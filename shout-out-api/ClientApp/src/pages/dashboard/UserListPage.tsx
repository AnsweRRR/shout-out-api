import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
import { useAuthContext } from 'src/auth/useAuthContext';
import { deleteUsersAsync, getUsersAsync } from 'src/api/userClient';
import { useLocales } from 'src/locales';
import { PATH_APP } from '../../routes/paths';
import { IUserAccountGeneral } from '../../@types/user';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
import { UserTableToolbar, UserTableRow } from '../../sections/user/list';

export default function UserListPage() {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();
  const { user } = useAuthContext();
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();
  const { translate } = useLocales();
  const [tableData, setTableData] = useState<Array<IUserAccountGeneral>>([]);
  const [filterName, setFilterName] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const TABLE_HEAD = [
    { id: 'name', label: translate('Maintenance.UserListTableHead.Name'), align: 'left' },
    { id: 'userName', label: translate('Maintenance.UserListTableHead.UserName'), align: 'left' },
    { id: 'email', label: translate('Maintenance.UserListTableHead.Email'), align: 'left' },
    { id: 'role', label: translate('Maintenance.UserListTableHead.Role'), align: 'left' },
    { id: 'verified', label: translate('Maintenance.UserListTableHead.Verified'), align: 'center' },
    { id: '' },
  ];

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const denseHeight = 72;
  const isFiltered = filterName !== '' || filterStatus !== 'all';

  const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterStatus);

  const getUsers = async () => {
    if (user) {
      const getUsersList = async () => {
        const result = await getUsersAsync(false, user?.accessToken);
        const userList = result.data;

        const userListGeneral: Array<IUserAccountGeneral> = userList.map((userData: any) => ({
          id: userData.id,
          avatarUrl: userData.avatar,
          firstName: userData.firstName,
          lastName: userData.lastName,
          userName: userData.userName,
          email: userData.email,
          isVerified: userData.verified,
          role: userData.role,
          birthDay: userData.birthday ? new Date(userData.birthday) : null,
          startAtCompany: userData.startAtCompany ? new Date(userData.startAtCompany) : null,
        }));

        setTableData(userListGeneral);
      }
      
      getUsersList();
    }
  }

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteRow = async (id: number) => {
    await deleteUsersAsync(id, user?.accessToken);
    getUsers();
  };

  const handleEditRow = (id: number) => {
    navigate(PATH_APP.user.edit(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus('all');
  };

  useEffect(() => {
    if (user) {
      const getUsersList = async () => {
        const result = await getUsersAsync(false, user?.accessToken);
        const userList = result.data;

        const userListGeneral: Array<IUserAccountGeneral> = userList.map((userData: any) => ({
          id: userData.id,
          avatarUrl: userData.avatar,
          firstName: userData.firstName,
          lastName: userData.lastName,
          userName: userData.userName,
          email: userData.email,
          isVerified: userData.verified,
          role: userData.role,
          birthDay: userData.birthday ? new Date(userData.birthday) : null,
          startAtCompany: userData.startAtCompany ? new Date(userData.startAtCompany) : null,
        }));

        setTableData(userListGeneral);
      }
      
      getUsersList();
    }
  }, [user]);

  return (
    <>
      <Helmet>
        <title>{`${translate('Maintenance.UserList')}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={`${translate('Maintenance.UserList')}`}
          links={[
            { name: `${translate('SideMenu.User')}`, href: PATH_APP.user.root },
            { name: `${translate('SideMenu.List')}` },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_APP.user.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              {`${translate('Maintenance.UserList')}`}
            </Button>
          }
        />

        <Card>
          <UserTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title={`${translate('Maintenance.Delete')}`}>
                  <IconButton color="primary" onClick={() => setOpenConfirm(true)}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size='medium' sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName
}: {
  inputData: IUserAccountGeneral[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.firstName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
