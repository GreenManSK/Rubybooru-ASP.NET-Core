using System.Collections.Generic;
using CommandLine;
using Microsoft.Extensions.Configuration;
using Rubybooru.Console.Options;

namespace Rubybooru.Console
{
    static class Program
    {
        private static int Main(string[] args)
        {
            return new Runner(args).Run();
            IConfiguration configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();
            //
            // System.Console.WriteLine($"Hello {configuration["DefaultPlaceholder"]}");
        }
    }
}