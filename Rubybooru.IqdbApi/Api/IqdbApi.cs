using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Rubybooru.IqdbApi.Api.Parser;

namespace Rubybooru.IqdbApi.Api
{
    public class IqdbApi : IIqdbApi, IDisposable
    {
        public const int MaxImageWidth = 7500;
        public const int MaxImageHeight = 7500;

        private const int MaxFileSize = 8388608;
        private static readonly Uri Url = new Uri("https://iqdb.org/");

        private const string FormUrl = "/";
        private const string FieldService = "service[]";
        private const string FieldFile = "file";
        private const string FieldUrl = "url";
        private const string FieldIgnoreColors = "forcegray";

        private readonly HttpClient httpClient;

        public IqdbApi()
        {
            httpClient = new HttpClient {BaseAddress = Url};
        }

        public void Dispose()
        {
            httpClient.Dispose();
        }

        public async Task<List<Match>> SearchFile(string path, Options options)
        {
            var fileSize = new FileInfo(path).Length;
            if (fileSize > MaxFileSize)
            {
                throw new FileSizeLimitException($"File size {fileSize}bytes of {path} is too large for iqdb");
            }

            var content = new MultipartFormDataContent
            {
                {new StreamContent(new MemoryStream(await File.ReadAllBytesAsync(path))), FieldFile, Path.GetFileName(path)}
            };

            return await Search(content, options);
        }

        public async Task<List<Match>> SearchUrl(string url, Options options)
        {
            var content = new MultipartFormDataContent {{new StringContent(url), FieldUrl}};
            return await Search(content, options);
        }

        private async Task<List<Match>> Search(MultipartFormDataContent content, Options options)
        {
            content.Add(new StringContent(options.IgnoreColors ? "1" : "0"), FieldIgnoreColors);
            foreach (var service in options.Services)
            {
                content.Add(new StringContent(service.Id.ToString()), FieldService);
            }

            var result = await httpClient.PostAsync(FormUrl, content);
            var htmlContent = await result.Content.ReadAsStringAsync();
            return IqdbParser.ParseHtml(Url, htmlContent);
        }
    }
}