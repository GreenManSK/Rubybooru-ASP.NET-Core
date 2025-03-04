using System.Collections.Generic;

namespace Rubybooru.Configuration
{
    public class PreviewOption
    {
        public int Width { get; set; }
        public int Height { get; set; }
        public bool KeepRatio { get; set; }
    }

    public class AllowedPreviewOptions
    {
        public List<PreviewOption> Options { get; set; } = new List<PreviewOption>();
    }
}