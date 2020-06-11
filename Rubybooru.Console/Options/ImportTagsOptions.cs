using CommandLine;

namespace Rubybooru.Console.Options
{
    [Verb("import-tags", HelpText = "Import model tags for DeepDanbooru tagger model")]
    public class ImportTagsOptions : DefaultOptions
    {
        [Option('p', "path", Required = true,
            HelpText = "Path to folder with tags.txt, tags-general.txt and tags-character.txt")]
        public string Path { get; set; }
    }
}