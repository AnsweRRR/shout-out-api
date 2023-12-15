import { TextField } from '@mui/material';
import { ChangeEventHandler, FormEventHandler } from 'react';
import { useStyle } from 'src/hooks/useStyle';
import { GiphyGIFSearchFormStyles } from 'src/utils/cssStyles';

type Props = {
  onSubmit: FormEventHandler<HTMLFormElement>,
  placeholder: string,
  setValue: ChangeEventHandler<HTMLInputElement>,
  value: string
}

const SearchForm = (props: Props) => {
    const { onSubmit, placeholder, setValue, value } = props;
    useStyle('SearchForm', GiphyGIFSearchFormStyles);

    return (
        <form
            data-testid="SearchFormForm"
            onSubmit={onSubmit}
            autoComplete="off"
            className="reactGiphySearchbox-searchForm-form"
        >
            <TextField
                data-testid="SearchFormInput"
                type="text"
                placeholder={placeholder}
                onChange={setValue}
                value={value}
                name="search"
                className="reactGiphySearchbox-searchForm-input"
            />
        </form>
    );
}
export default SearchForm;