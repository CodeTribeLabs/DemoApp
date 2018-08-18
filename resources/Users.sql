USE [omnidb]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[Users](
	[AcctId] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [varchar](50) NULL,
	[Email] [varchar](50) NULL,
	[Password] [varchar](50) NULL,
	[FirstName] [varchar](50) NULL,
	[LastName] [varchar](50) NULL,
	[AuthToken] [varchar](200) NULL,
	[GameCredits] [int] NOT NULL DEFAULT 0,
	[GameCurrency] [int] NOT NULL DEFAULT 0,
	[Status] [int] NOT NULL DEFAULT 0
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

