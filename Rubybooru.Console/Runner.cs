using System.Collections.Generic;
using CommandLine;
using Microsoft.EntityFrameworkCore;
using Rubybooru.Console.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Rubybooru.Console.Runners;
using Rubybooru.Data;
using Rubybooru.Data.Interfaces;
using Rubybooru.Data.Sql;
using Rubybooru.Images;

namespace Rubybooru.Console
{
    public class Runner
    {
        public string[] Args { get; set; }

        public Runner(string[] args)
        {
            Args = args;
        }

        public int Run()
        {
            return Parser.Default.ParseArguments<ImportOptions, ImportTagsOptions>(Args)
                .MapResult(
                    (ImportOptions o) => RunImport(o),
                    (ImportTagsOptions o) => RunImportTags(o),
                    HandleParseError
                );
        }

        private int RunImportTags(ImportTagsOptions options)
        {
            var serviceProvider = BuildServiceProvider(options);
            return serviceProvider.GetService<TagImport>().Run(options);
        }

        private int RunImport(ImportOptions options)
        {
            var serviceProvider = BuildServiceProvider(options);
            return serviceProvider.GetService<Import>().Run(options);
        }

        private ServiceProvider BuildServiceProvider(DefaultOptions options)
        {
            var serviceCollection = new ServiceCollection();
            var configuration = BuildConfiguration(options);

            serviceCollection.AddSingleton<IConfiguration>(configuration);
            serviceCollection.AddDbContextPool<RubybooruDbContext>(opts =>
            {
                opts
                    .UseLazyLoadingProxies()
                    .UseMySQL(configuration.GetConnectionString("RubybooruDb"));
            });

            serviceCollection.AddSingleton<IImageInfo, ImageInfo>();
            
            serviceCollection.AddScoped<ITagData, SqlTagData>();
            serviceCollection.AddScoped<IImageData, SqlImageData>();
            serviceCollection.AddScoped<IImageTagData, SqlImageTagData>();

            serviceCollection.AddScoped<TagImport>();
            serviceCollection.AddScoped<Import>();

            return serviceCollection.BuildServiceProvider();
        }

        private IConfiguration BuildConfiguration(DefaultOptions options)
        {
            return new ConfigurationBuilder()
                .AddJsonFile(GetConfigFilePath(options), optional: false, reloadOnChange: true)
                .Build();
        }

        private string GetConfigFilePath(DefaultOptions options)
        {
            return options.Development ? "appsettings.Development.json" : "appsettings.json";
        }

        private static int HandleParseError(IEnumerable<Error> obj)
        {
            System.Console.Error.WriteLine("Error while parsing arguments. Use --help to find out how to use");
            return -1;
        }
    }
}