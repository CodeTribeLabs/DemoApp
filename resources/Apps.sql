USE [omnidb]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[Apps](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AppBundle] [varchar](50) NOT NULL CONSTRAINT [DF_Apps_AppBundle]  DEFAULT ('-'),
	[AppName] [varchar](50) NOT NULL CONSTRAINT [DF_Apps_AppName]  DEFAULT ('-'),
	[Category] [int] NOT NULL CONSTRAINT [DF_Apps_Category]  DEFAULT ((1)),
	[Genre] [varchar](50) NOT NULL CONSTRAINT [DF_Apps_Genre]  DEFAULT ('ARCADE'),
	[GenreKeys] [varchar](100) NOT NULL CONSTRAINT [DF_Apps_GenreKeys]  DEFAULT ('ARCADE'),
	[ListingKeys] [varchar](100) NOT NULL CONSTRAINT [DF_Apps_ListingKeys]  DEFAULT ('ALL'),
	[UserRating] [varchar](10) NOT NULL CONSTRAINT [DF_Apps_UserRating]  DEFAULT ('1.0'),
	[ContentRating] [varchar](30) NOT NULL CONSTRAINT [DF_Apps_ContentRating]  DEFAULT ('Everyone'),
	[ContentCategory] [varchar](30) NOT NULL CONSTRAINT [DF_Apps_ContentCategory]  DEFAULT ('General'),
	[FullDescription] [varchar](200) NOT NULL CONSTRAINT [DF_Apps_FullDescription]  DEFAULT ('-'),
	[ShortDescription] [varchar](150) NOT NULL CONSTRAINT [DF_Apps_ShortDescription]  DEFAULT ('-'),
	[Version] [varchar](10) NOT NULL CONSTRAINT [DF_Apps_Version]  DEFAULT ('1.0'),
	[PublisherId] [int] NOT NULL CONSTRAINT [DF_Apps_PublisherId]  DEFAULT ((0)),
	[IconUrl] [varchar](200) NOT NULL CONSTRAINT [DF_Apps_IconUrl]  DEFAULT ('-'),
	[Screenshot1Url] [varchar](200) NOT NULL CONSTRAINT [DF_Apps_Screenshot1Url]  DEFAULT ('-'),
	[Screenshot2Url] [varchar](200) NOT NULL CONSTRAINT [DF_Apps_Screenshot2Url]  DEFAULT ('-'),
	[Screenshot3Url] [varchar](200) NOT NULL CONSTRAINT [DF_Apps_Screenshot3Url]  DEFAULT ('-'),
	[Screenshot4Url] [varchar](200) NOT NULL CONSTRAINT [DF_Apps_Screenshot4Url]  DEFAULT ('-'),
	[Screenshot5Url] [varchar](200) NOT NULL CONSTRAINT [DF_Apps_Screenshot5Url]  DEFAULT ('-'),
	[Status] [int] NOT NULL CONSTRAINT [DF_Apps_Status]  DEFAULT ((0)),
 CONSTRAINT [PK_Apps] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

INSERT INTO Apps (AppBundle,AppName,Category,Genre,GenreKeys,ListingKeys,UserRating,ContentRating,ContentCategory,FullDescription,ShortDescription,Version,PublisherId,IconUrl,Screenshot1Url,Screenshot2Url,Screenshot3Url,Screenshot4Url,Screenshot5Url,Status) VALUES
('com.omnigames.HighLow','High Low',2,CARD,'GAME,CARD,CASINO','ALL,POPULAR','4.5','Rated for 12+','Gambling','The most simple card game ever! Just guess if the card is High or Low','Simple but fun card game','1.0',1,'https://lh3.googleusercontent.com/3kRDA4aj27fCeKvwhqf0GjbIAFAfic_iOl4C3nPJIYw7JirRS-0dEay8ENc5tfE9hZY', '-', '-', '-', '-', '-', 1),
('com.omnigames.Higher','Higher',2,CARD,'GAME,CARD,CASINO','ALL,POPULAR','4.5','Rated for 12+','Gambling','Another simple card game! Just select a higher card to beat the revealed card','Another simple but fun card game','1.0',1,'https://lh3.ggpht.com/F5Yf9CTYDpz2uNWhe1VdikdXP0WvTVpwqPmT-N79507TuSsMz-mDXoAR4J4bbNLH_g', '-', '-', '-', '-', '-', 1),
('com.omnigames.BlackJack','Black Jack',2,CARD,'GAME,CARD,CASINO','ALL,NEW','4.5','Rated for 12+','Gambling','Play the best Blackjack 21 game on the planet. Just jump right in, play and win!','Feeling lucky? Try our BlackJack!','1.0',1,'https://lh3.googleusercontent.com/-Cej6ynw-M_JZyoGEiN_rW_eJEHqEVSF3pW3BLLW7Vb2WwI6K5yzpAAhk7Cnxvxd1_4', '-', '-', '-', '-', '-', 0)
GO