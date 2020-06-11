namespace Rubybooru.Console
{
    static class Program
    {
        private static int Main(string[] args)
        {
            return new Runner(args).Run();
        }
    }
}