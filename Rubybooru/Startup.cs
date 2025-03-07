using System;
using System.IO;
using System.Security.Cryptography;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Rubybooru.Configuration;
using Rubybooru.Controllers;
using Rubybooru.Data;
using Rubybooru.Data.Interfaces;
using Rubybooru.Data.Sql;
using Rubybooru.Helpers;
using Rubybooru.Images;

namespace Rubybooru
{
    public class Startup
    {
        private const string ClientUrl = "";

        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _env = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            if (_env.IsDevelopment())
            {
                services.AddCors(o => o.AddPolicy("DevelopmentPolicy", builder =>
                {
                    builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                }));
            }

            services.AddDbContextPool<RubybooruDbContext>(options =>
            {
                if (_env.IsDevelopment() && _configuration.GetValue<bool>("LogQueries"))
                {
                    options.UseLoggerFactory(LoggerFactory.Create(builder => builder.AddConsole()));
                }

                options
                    .UseLazyLoadingProxies()
                    .UseSqlite(_configuration.GetConnectionString("RubybooruDb"));
            });

            services.AddScoped<IImageData, SqlImageData>();
            services.AddScoped<ITagData, SqlTagData>();
            services.AddScoped<IImageTagData, SqlImageTagData>();
            services.AddScoped<IDuplicateRecordData, SqlDuplicateRecordData>();
            services.AddScoped<ITagDuplicateData, SqlTagDuplicateData>();
            services.AddScoped<IImagePreviewData, SqlImagePreviewData>();

            services.AddSingleton<IPreviewMaker, PreviewMaker>();
            services.AddScoped<PreviewGenerator>();

            services.AddAutoMapper(typeof(Startup));

            services.AddControllers();

            services.Configure<AllowedPreviewOptions>(_configuration.GetSection("AllowedPreviewOptions"));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseCors("DevelopmentPolicy");
            }

            app.Use(async (context, next) =>
            {
                await next();
                if (context.Response.StatusCode == 404)
                {
                    var path = context.Request.Path.ToString();
                    if (path.StartsWith("/static/"))
                    {
                        Console.WriteLine($@"Url not found: {path}");
                    }

                    context.Request.Path = "/";
                    await next();
                }
            });

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(_configuration.GetValue<string>("ImagesPath")),
                RequestPath = ImageController.StaticImagesPath
            });

            app.UseDefaultFiles(GetDefaultFileOptions());
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(_configuration.GetValue<string>("ClientBuildPath")),
                RequestPath = ClientUrl
            });

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/api", async context =>
                {
                    context.Response.ContentType = "text/*; charset=utf-8";
                    await context.Response.WriteAsync("がんばルビィ");
                });
                endpoints.MapControllers();
            });
        }

        private DefaultFilesOptions GetDefaultFileOptions()
        {
            var path = _configuration.GetValue<string>("ClientBuildPath");
            var fileProvider = new PhysicalFileProvider(path);

            var options = new DefaultFilesOptions
            {
                FileProvider = fileProvider,
                RequestPath = ClientUrl
            };
            options.DefaultFileNames.Add("index.html");
            return options;
        }
    }
}