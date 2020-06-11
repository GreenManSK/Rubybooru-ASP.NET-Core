using CommandLine;

namespace Rubybooru.Console.Options
{
    [Verb("generate-preview", HelpText = "Generate preview images for images without it")]
    public class GeneratePreviewOptions : DefaultOptions
    {
        [Option('w', "width", Required = false, HelpText = "Width for preview images")]
        public int Width { get; set; } = 350;
        
        [Option('h', "height", Required = false, HelpText = "Height for preview images")]
        public int Height { get; set; } = 180;

        [Option('k', "keep-ratio", Required = false, HelpText = "Keep aspect ratio")]
        public bool KeepRatio { get; set; } = true;
    }
}