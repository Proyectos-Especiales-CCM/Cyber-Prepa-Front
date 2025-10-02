import {
    FormControl,
    InputLabel,
    Stack,
    MenuItem,
    Box,
    IconButton,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { Image } from '../../services/types';
import { Close, Upload } from '@mui/icons-material';
import { completeImageUrl } from '../../services';

interface SelectOrUploadImageProps {
    uploadImage: boolean;
    imageId: string;
    handleImageIdChange: (event: SelectChangeEvent) => void;
    handleImageFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectOrUploadImageChange: () => void;
    images: Image[];
}

const selectOrUploadImage: React.FC<SelectOrUploadImageProps> = ({ uploadImage, imageId, handleImageIdChange, handleImageFileChange, handleSelectOrUploadImageChange, images }) => {

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
        >
            {
                uploadImage ? <input id='upload-image-input' type="file" accept='image/*' onChange={handleImageFileChange} /> : (
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120, backgroundColor: '#949fb0', borderRadius: '2px' }}>
                        <InputLabel id="imageId-label" sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Imagen</InputLabel>
                        <Select
                            labelId="imageId-label"
                            id="selected-imageId"
                            value={imageId}
                            onChange={handleImageIdChange}
                            label="imageId"
                        >
                            <MenuItem value="">
                                <em>Ninguna</em>
                            </MenuItem>
                            {images.map((image) => (
                                <MenuItem value={image.id} key={image.id}>
                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img src={completeImageUrl(image.image ?? '')} style={{ width: 'auto', height: '25px', maxWidth: '40px' }} />
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )
            }
            <IconButton
                id='change-select-or-upload'
                color="primary"
                aria-label="select-or-upload"
                onClick={handleSelectOrUploadImageChange}
            >
                {uploadImage ? <Close /> : <Upload />}
            </IconButton>
        </Stack>
    )
}

export default selectOrUploadImage;
