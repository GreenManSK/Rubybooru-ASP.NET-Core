using CommandLine;

namespace Rubybooru.Console.Options
{
    [Verb("iqdb-tagger", HelpText = "Add copyrights and characters to images without any copyright tag")]
    public class IqdbTaggerOptions : DefaultOptions
    {
        [Option('r', "recheckDeepbooru", Required = false, HelpText = "Recheck images tagged by deepbooru to fix characters and copyrights tags")]
        public bool RecheckDeepbooru { get; set; } = false;
        
        [Option('m', "age", Required = false, HelpText = "Maximum age of image to recheck in years")]
        public int MaxAge { get; set; } = 1;

        [Option('a', "addAuthors", Required = false, HelpText = "Add author tags to images without author tag")]
        public bool AddAuthors { get; set; } = false;
    }
}