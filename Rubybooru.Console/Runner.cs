using System.Collections.Generic;
using System.Security.Cryptography;
using CommandLine;
using ImageProcessor.Imaging.Quantizers;
using ImageProcessor.Imaging.Quantizers.WuQuantizer;
using Microsoft.EntityFrameworkCore;
using Rubybooru.Console.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Rubybooru.Console.Runners;
using Rubybooru.Data;
using Rubybooru.Data.Interfaces;
using Rubybooru.Data.Sql;
using Rubybooru.Helpers;
using Rubybooru.Images;
using Rubybooru.Images.DuplicateFinder;

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
            return Parser.Default.ParseArguments<ImportOptions, ImportTagsOptions, GeneratePreviewOptions, CopyrightAdderOptions, DuplicateCheckOptions>(Args)
                .MapResult(
                    (ImportOptions o) => RunImport(o),
                    (ImportTagsOptions o) => RunImportTags(o),
                    (GeneratePreviewOptions o) => RunGeneratePreview(o),
                    (CopyrightAdderOptions o) => RunCopyrightAdder(o),
                    (DuplicateCheckOptions o) => RunDuplicateCheck(o),
                    HandleParseError
                );
        }

        private int RunDuplicateCheck(DuplicateCheckOptions options)
        {
            var serviceProvider = BuildServiceProvider(options);
            return serviceProvider.GetService<DuplicateCheck>().Run(options);
        }

        private int RunCopyrightAdder(CopyrightAdderOptions options)
        {
            var serviceProvider = BuildServiceProvider(options);
            return serviceProvider.GetService<Runners.CopyrightAdder>().Run(options);
        }

        private int RunGeneratePreview(GeneratePreviewOptions options)
        {
            var serviceProvider = BuildServiceProvider(options);
            return serviceProvider.GetService<GeneratePreview>().Run(options);
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

            serviceCollection.AddSingleton<HashAlgorithm, SHA256CryptoServiceProvider>();
            serviceCollection.AddSingleton<IPreviewMaker, PreviewMaker>();
            serviceCollection.AddSingleton<PreviewGenerator, PreviewGenerator>();
            serviceCollection.AddSingleton<IImageInfo, ImageInfo>();

            serviceCollection.AddSingleton<ImagePreprocessorUtils>();
            serviceCollection.AddSingleton<IImagePreprocessorFactory, ImagePreprocessorFactory>();
            serviceCollection.AddSingleton<IQuantizer, WuQuantizer>();
            
            serviceCollection.AddScoped<ITagData, SqlTagData>();
            serviceCollection.AddScoped<IImageData, SqlImageData>();
            serviceCollection.AddScoped<IImageTagData, SqlImageTagData>();
            serviceCollection.AddScoped<IDuplicateRecordData, SqlDuplicateRecordData>();

            serviceCollection.AddScoped<TagImport>();
            serviceCollection.AddScoped<Import>();
            serviceCollection.AddScoped<GeneratePreview>();
            serviceCollection.AddScoped<DuplicateCheck>();
            serviceCollection.AddScoped<Runners.CopyrightAdder>();

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