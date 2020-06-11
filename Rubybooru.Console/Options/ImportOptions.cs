using CommandLine;

namespace Rubybooru.Console.Options
{
    [Verb("import", HelpText = "Import images tagged by DeepDanbooru tagger")]
    public class ImportOptions : DefaultOptions
    {
        [Option('r', "results", Required = true, HelpText = "Path to file with results from tagging")]
        public string ResultsFile { get; set; }

        [Option('m', "root", Required = false,
            HelpText = "Specify part of path that should be removed. If not present uses ImagesPath from config")]
        public string PathRoot { get; set; }
    }
}