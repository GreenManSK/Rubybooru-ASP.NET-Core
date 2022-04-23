using CommandLine;

namespace Rubybooru.Console.Options
{
    [Verb("duplicate-check", HelpText = "Check for new duplicate images")]
    public class DuplicateCheckOptions : DefaultOptions
    {
        [Option('g', "generate", Required = false, HelpText="Generate all bw images")]
        public bool GenerateImages { get; set; }
    }
}