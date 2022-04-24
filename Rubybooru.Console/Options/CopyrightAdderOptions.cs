using CommandLine;

namespace Rubybooru.Console.Options
{
    [Verb("copyright-adder", HelpText = "Add copyright to images based on characters on them")]
    public class CopyrightAdderOptions : DefaultOptions
    {
        [Option('m', "map", Required = false, HelpText = "Path to map build from Danbooru tags.")]
        public string CopyrightMapPath { get; set; }

        [Option('r', "raw", Required = false,
            HelpText = "Path to data from Danbooru dataset, if present builds map instead of adding copyright")]
        public string RawImageData { get; set; }

        [Option('p', "p-limit", Required = false, HelpText = "")]
        public double PercentageLimit { get; set; } = 0.1;

        [Option('s', "start", Required = false, HelpText = "Lower bound (<=) for image id to add copyright")]
        public int StartId { get; set; } = 1;

        [Option('e', "end", Required = false,
            HelpText = "Upper bound (>=) for image id to add copyright, -1 is no upper bound")]
        public int EndId { get; set; } = -1;

        [Option('f', "filter", Required = false, HelpText = "Id of tag to filter images by")]
        public int FilterTagId { get; set; } = -1;

        [Option('c', "copyright", Required = false, HelpText = "Tag to add to images without copyright with filtered tag")]
        public int CopyrightTagId { get; set; } = -1;

        [Option("systemTags", Required = false, HelpText = "Add system tags based on how copyright was added")]
        public bool AddSystemTags { get; set; } = false;
    }
}