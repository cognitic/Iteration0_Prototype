using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Iteration0.Business.Domain.Entities;
using Iteration0.Business.Interfaces;

namespace Iteration0.Business.Services
{
    public class MockUpGeneratorService : IMockUpGeneratorService
    {
//La variabilité des functions a été encapsulée via les patterns Strategy et Factory
//Une interface destinée à l'injection d'un répository pour chaque Aggregate.
//Un Service d'infrastructure en charge du datamapping des DTOs avec les attributs du domain
//Un business service pour chaque aggregate qui a la responsabilité d'une collaboration avec de l'infrastructure


    }
}