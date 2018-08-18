using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using DemoServer.Contexts;
using DemoServer.Models;
using DemoServer.Utils;

namespace DemoServer.Controllers
{
    public class FeedData
    {
        public int BoardId { get; set; }
        public int AcctId { get; set; }
        public string DisplayName { get; set; }
        public string Content { get; set; }
        public string Digest { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class FeedsController : ControllerBase
    {
        readonly FeedDbContext _dbContext;

        public FeedsController(
            FeedDbContext feedDbContext)
        {
            this._dbContext = feedDbContext;
        }

        //[Authorize]
        [HttpGet]
        public async Task<IActionResult> Get([FromBody] FeedData feedData)
        {
            return Ok(_dbContext.Feeds);
        }

        [HttpGet("{boardId}")]
        public async Task<IActionResult> Get([FromRoute] int boardId)
        {
            return Ok(_dbContext.Feeds.Where(f => f.BoardId == boardId));
        }

        //[Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] FeedData feedData)
        {
            Feed feed = new Feed
            {
                BoardId = feedData.BoardId,
                AcctId = feedData.AcctId,
                DisplayName = feedData.DisplayName,
                Content = feedData.Content,
                OwnerId = "",
                TimeStamp = DateUtils.ConvertToUnixTime(DateTime.UtcNow),
            };

            _dbContext.Add(feed);
            await _dbContext.SaveChangesAsync();

            return Ok(feed);
        }

        //[Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] FeedData feedData)
        {
            var feed = await _dbContext.Feeds.SingleOrDefaultAsync(b => b.Id == id);

            // If feed is not found, return an error
            if (feed == null)
                return NotFound();
            // If feed id is not the same as the requested id, return an error
            if (feed.Id != id)
                return BadRequest();

            feed.Content = feedData.Content;
            feed.DisplayName = feedData.DisplayName;
            //feed.TimeStamp = DateUtils.ConvertToUnixTime(DateTime.UtcNow);

            _dbContext.Entry(feed).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();

            return Ok(feed);
        }

        //[Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var feed = await _dbContext.Feeds.SingleOrDefaultAsync(b => b.Id == id);

            // If feed is not found, return an error
            if (feed == null)
                return NotFound();
            // If feed id is not the same as the requested id, return an error
            if (feed.Id != id)
                return BadRequest();

            _dbContext.Entry(feed).State = EntityState.Deleted;
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}