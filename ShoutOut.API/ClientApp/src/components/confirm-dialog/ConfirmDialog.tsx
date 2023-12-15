import { Dialog, Button, DialogTitle, DialogActions, DialogContent } from '@mui/material';
import { useLocales } from 'src/locales';
import { ConfirmDialogProps } from './types';

export default function ConfirmDialog({
  title,
  content,
  action,
  open,
  onClose,
  ...other
}: ConfirmDialogProps) {
  const { translate } = useLocales();

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>}

      <DialogActions>
        {action}

        <Button variant="outlined" color="inherit" onClick={onClose}>
          {`${translate('Maintenance.Cancel')}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
