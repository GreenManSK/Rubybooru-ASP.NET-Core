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
using Rubybooru.Controllers;
using Rubybooru.Data;
using Rubybooru.Data.Interfaces;
using Rubybooru.Data.Sql;

namespace Rubybooru
{
    public class Startup
    {
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
            services.AddDbContextPool<RubybooruDbContext>(options =>
            {
                if (_env.IsDevelopment() && _configuration.GetValue<bool>("LogQueries"))
                {
                    options.UseLoggerFactory(LoggerFactory.Create(builder => builder.AddConsole()));
                }

                options
                    .UseLazyLoadingProxies()
                    .UseMySQL(_configuration.GetConnectionString("RubybooruDb"));
            });

            services.AddScoped<IImageData, SqlImageData>();
            services.AddScoped<ITagData, SqlTagData>();
            services.AddScoped<IImageTagData, SqlImageTagData>();

            services.AddAutoMapper(typeof(Startup));
            
            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(@"C:\Users\lukas\OneDrive\Desktop\RubyTest"),
                RequestPath = ImageController.StaticImagesPath
            });
            
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    context.Response.ContentType = "text/*; charset=utf-8";
                    await context.Response.WriteAsync("がんばルビィ");
                });
                endpoints.MapControllers();
            });
        }
    }
}