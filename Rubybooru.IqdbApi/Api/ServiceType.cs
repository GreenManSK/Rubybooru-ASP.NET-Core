using System;
using System.Collections.Generic;

namespace Rubybooru.IqdbApi.Api
{
    public sealed class ServiceType
    {
        public static readonly ServiceType Danbooru = new ServiceType(1, "danbooru.donmai.us");
        public static readonly ServiceType Konachan = new ServiceType(2, "konachan.com");
        public static readonly ServiceType YandeRe = new ServiceType(3, "yande.re");
        public static readonly ServiceType Gelbooru = new ServiceType(4, "gelbooru.com");
        public static readonly ServiceType SankakuChannel = new ServiceType(5, "chan.sankakucomplex.com");
        public static readonly ServiceType EShuushuu = new ServiceType(6, "e-shuushuu.net");
        public static readonly ServiceType Zerochan = new ServiceType(11, "zerochan.net");
        public static readonly ServiceType AnimePictures = new ServiceType(13, "anime-pictures.net");

        public static IEnumerable<ServiceType> Values
        {
            get
            {
                yield return Danbooru;
                yield return Konachan;
                yield return YandeRe;
                yield return Gelbooru;
                yield return SankakuChannel;
                yield return EShuushuu;
                yield return Zerochan;
                yield return AnimePictures;
            }
        }

        public int Id { get; }
        public string Domain { get; }

        private ServiceType(int id, string domain)
        {
            Id = id;
            Domain = domain;
        }

        public static ServiceType GetTypeByUrl(Uri url)
        {
            foreach (var service in Values)
            {
                if (url.ToString().Contains(service.Domain))
                {
                    return service;
                }
            }

            throw new ArgumentOutOfRangeException(nameof(url), "URL dose not match any type");
        }
    }
}