using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace ShoutOut.Helpers
{
    public class ImageResizer
    {
        public string GetResizedImageDataUri(byte[] imageData, int? targetHeight = 100, int? targetWidth = null)
        {
            using (Image<Rgba32> image = Image.Load<Rgba32>(imageData))
            {
                int originalWidth = image.Width;
                int originalHeight = image.Height;

                if (!targetHeight.HasValue && targetWidth.HasValue)
                {
                    targetHeight = (int)((float)originalHeight / originalWidth * targetWidth);
                }
                else if (!targetWidth.HasValue && targetHeight.HasValue)
                {
                    targetWidth = (int)((float)originalWidth / originalHeight * targetHeight);
                }

                Image<Rgba32> resizedImage = image.Clone(x => x.Resize((int)targetWidth!, (int)targetHeight!));

                var resizedImageBase64 = resizedImage.ToBase64String(SixLabors.ImageSharp.Formats.Jpeg.JpegFormat.Instance);

                var fileExtension = "jpg";
                var dataUri = $"data:image/{fileExtension};base64,{resizedImageBase64}";

                return dataUri;
            }
        }
    }
}
