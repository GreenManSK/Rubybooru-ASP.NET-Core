using System.Collections.Generic;
using HtmlAgilityPack;

namespace Rubybooru.IqdbApi.Parsers.Impl
{
    public class KonachanParser : MoebooruParser
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
                    GetTagType(tag.GetAttributeValue("data-type", "")),
                    tag.GetAttributeValue("data-name", "")
                ));
            }

            return result;
        }

        private static TagType GetTagType(string type)
        {
            return type switch
            {
                "copyright" => TagType.Copyright,
                "circle" => TagType.Circle,
                "character" => TagType.Character,
                "artist" => TagType.Artist,
                "style" => TagType.Style,
                _ => TagType.General
            };
        }
    }
}