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
    public class BoardData
    {
        public int AcctId { get; set; }
        public int BoardId { get; set; }
        public string DisplayName { get; set; }
        public string Title { get; set; }
        public string Digest { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class BoardsController : ControllerBase
    {
        readonly BoardDbContext _dbContext;

        public BoardsController(
            BoardDbContext boardDbContext)
        {
            this._dbContext = boardDbContext;
        }

        //[Authorize]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(_dbContext.Boards.OrderByDescending(b => b.Id));
        }

        //[Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] BoardData boardData)
        {
            Board board = new Board
            {
                AcctId = boardData.AcctId,
                DisplayName = boardData.DisplayName,
                Title = boardData.Title,
                OwnerId = "",
                TimeStamp = DateUtils.ConvertToUnixTime(DateTime.UtcNow),
            };

            _dbContext.Add(board);
            await _dbContext.SaveChangesAsync();

            return Ok(board);
        }

        //[Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] BoardData boardData)
        {
            var board = await _dbContext.Boards.SingleOrDefaultAsync(b => b.Id == id);

            // If board is not found, return an error
            if (board == null)
                return NotFound(id);
            // If board id is not the same as the requested id, return an error
            if (board.Id != id)
                return BadRequest(id);

            board.Title = boardData.Title;
            board.DisplayName = boardData.DisplayName;
            //board.TimeStamp = DateUtils.ConvertToUnixTime(DateTime.UtcNow);

            _dbContext.Entry(board).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();

            return Ok(board);
        }

        //[Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var board = await _dbContext.Boards.SingleOrDefaultAsync(b => b.Id == id);

            // If board is not found, return an error
            if (board == null)
                return NotFound();
            // If board id is not the same as the requested id, return an error
            if (board.Id != id)
                return BadRequest();

            _dbContext.Entry(board).State = EntityState.Deleted;
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}