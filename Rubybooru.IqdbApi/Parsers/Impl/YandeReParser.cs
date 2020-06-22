﻿using System.Collections.Generic;
using System.Linq;
using HtmlAgilityPack;

namespace Rubybooru.IqdbApi.Parsers.Impl
{
    public class YandeReParser : MoebooruParser
    {
        protected override List<Tag> GetTags(HtmlDocument doc)
        {
            var result = new List<Tag>();

            var tagContainer = doc.GetElementbyId(TagContainerId);
            if (tagContainer == null)
            {
                return result;
            }

            var tags = tagContainer.Descendants("li");
            foreach (var tag in tags)
            {
                result.Add(new Tag(
                    GetTagType(tag.GetAttributeValue("class", "")),
                    tag.Descendants("a").ElementAt(1).InnerText
                ));
            }

            return result;
        }

        private static TagType GetTagType(string type)
        {
            return type switch
            {
                "tag-type-copyright" => TagType.Copyright,
                "tag-type-circle" => TagType.Circle,
                "tag-type-character" => TagType.Character,
                "tag-type-artist" => TagType.Artist,
                "tag-type-faults" => TagType.Faults,
                _ => TagType.General
            };
        }
    }
}