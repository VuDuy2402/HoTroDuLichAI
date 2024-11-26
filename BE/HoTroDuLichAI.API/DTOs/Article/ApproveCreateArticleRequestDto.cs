using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HoTroDuLichAI.API
{
    public class ApproveCreateArticleRequestDto
    {
        public Guid ArticleId { get; set; }
        public CApprovalType Type { get; set; }
    }
}