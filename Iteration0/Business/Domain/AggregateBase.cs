using System;
using Iteration0.Business.Domain.Entities;
using Iteration0.Business.Interfaces;

namespace Iteration0.Business.Domain
{
    public class AggregateBase
    {
        public IEntity rootDefinition { get; protected set; }
    }
}