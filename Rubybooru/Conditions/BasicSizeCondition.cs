using System;
using System.Linq;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;

namespace Rubybooru.Conditions
{
    public class BasicSizeCondition : ISizeCondition
    {
        public BasicSizeConditionType Type;
        public BasicSizeConditionOperation Operation;
        public double RatioValue;

        public IQueryable<Image> Apply(IQueryable<Image> images)
        {
            return Type switch
            {
                BasicSizeConditionType.SideSize => SideSizeApply(images),
                BasicSizeConditionType.SideRatio => SideRatioApply(images),
                _ => throw new ArgumentOutOfRangeException()
            };
        }

        private IQueryable<Image> SideRatioApply(IQueryable<Image> images)
        {
            return Operation switch
            {
                BasicSizeConditionOperation.Equals => images.Where(i => i.SideRatio == RatioValue),
                BasicSizeConditionOperation.GreaterEquals => images.Where(i => i.SideRatio >= RatioValue),
                BasicSizeConditionOperation.LessEquals => images.Where(i => i.SideRatio <= RatioValue),
                BasicSizeConditionOperation.NotEquals => images.Where(i => i.SideRatio != RatioValue),
                _ => throw new ArgumentOutOfRangeException()
            };
        }

        private IQueryable<Image> SideSizeApply(IQueryable<Image> images)
        {
            return Operation switch
            {
                BasicSizeConditionOperation.Equals => images.Where(i => i.Width == i.Height),
                BasicSizeConditionOperation.GreaterEquals => images.Where(i => i.Width >= i.Height),
                BasicSizeConditionOperation.LessEquals => images.Where(i => i.Width <= i.Height),
                BasicSizeConditionOperation.NotEquals => images.Where(i => i.Width != i.Height),
                _ => throw new ArgumentOutOfRangeException()
            };
        }
    }
}