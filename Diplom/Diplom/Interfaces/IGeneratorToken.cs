using Diplom.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Interfaces
{
    public interface IGeneratorToken
    {
        string GenerateToken(User user);
    }
}
