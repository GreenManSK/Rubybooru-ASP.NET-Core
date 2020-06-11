using CommandLine;

namespace Rubybooru.Console.Options
{
    public abstract class DefaultOptions
    {
        [Option('d', "develop", Required = false, HelpText="Use development configuration file")]
        public bool Development { get; set; }
    }
}