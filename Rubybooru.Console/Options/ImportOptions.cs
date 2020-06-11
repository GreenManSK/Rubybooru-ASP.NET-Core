using CommandLine;

namespace Rubybooru.Console.Options
{
    [Verb("import", HelpText = "Import images tagged by DeepDanbooru tagger")]
    public class ImportOptions : DefaultOptions
    {
        [Option('r', "results", Required = true, HelpText = "Path to file with results from tagging")]
        public string ResultsFile { get; set; }
    }
}