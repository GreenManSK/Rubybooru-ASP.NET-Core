using System;

namespace Rubybooru.IqdbApi.Api
{
    public class FileSizeLimitException : Exception
    {
        public FileSizeLimitException(string? message) : base(message)
        {
        }
    }
}