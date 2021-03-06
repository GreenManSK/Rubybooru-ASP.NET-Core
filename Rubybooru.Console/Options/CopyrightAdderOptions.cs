using CommandLine;

namespace Rubybooru.Console.Options
{
    [Verb("copyright-adder", HelpText = "Add copyright to images based on characters on them")]
    public class CopyrightAdderOptions : DefaultOptions
    {
        [Option('m', "map", Required=true, HelpText = "Path to map build from Danbooru tags.")]
        public string CopyrightMapPath { get; set; }
        
        [Option('r', "raw", Required = false, HelpText = "Path to data from Danbooru dataset, if present builds map instead of adding copyright")]
        public string RawImageData { get; set; }

        [Option('p', "p-limit", Required = false, HelpText = "")]
        public double PercentageLimit { get; set; } = 0.1;
        
        [Option('s', "start", Required = false, HelpText = "Lower bound (<=) for image id to add copyright")]
        public int StartId { get; set; } = 1;
        
        [Option('e', "end", Required = false, HelpText = "Upper bound (>=) for image id to add copyright, -1 is no upper bound")]
        public int EndId { get; set; } = -1;
    }
}