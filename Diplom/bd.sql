create database Music_DB;
go
create table UserRoles(
RoleId int primary key identity(1,1),
RoleName nvarchar(50) not null unique
)
go
insert into UserRoles values('User'),('Admin')
go
create table Users(
UserId int primary key identity(1,1),
RoleId int references UserRoles(RoleId) not null,
Login nvarchar(50) not null unique,
Mail nvarchar(100) not null unique,
Password nvarchar(500) not null,
Avatar nvarchar(200) not null,
AvatarFile nvarchar(200) not null,
Name nvarchar(100),
Surname nvarchar(100),
Country nvarchar(100),
City nvarchar(100),
IsMailConfirmed bit,
VerifyCode uniqueidentifier not null,
RegistrationDate date not null
)
go
create table MusicGenres(
MusicGenreId int primary key identity(1,1),
GenreName nvarchar(100) not null,
GenreDescription nvarchar(4000) not null
) 
go
insert into MusicGenres(GenreName, GenreDescription) values(N'Поп',N'Поп-музыка (англ. pop music, образовано от popular music – популярная музыка) – один из современных музыкальных стилей, рассчитанный на широкую публику, элемент массовой культуры. К поп-музыке относятся такие течения, как латина, европоп, диско, дэнс и др.')
,(N'Рок',N'жанр музыки, характеризующийся ярко выраженным ритмом. Так же является обобщённым названием для ряда музыкальных стилей и направлений. Многообразие жанров и поджанров рок-музыки градируется от "легкого" до "тяжёлого.')
,(N'Электроника',N'музыка, созданная с использованием электромузыкальных инструментов и электронных технологий')
,(N'Рэп',N'это исполнение словесного речитатива под ритмичную музыку. Рэпер читает текст под бит, который также может сопровождаться электронной музыкой. Тематика текстов абсолютно любая, как и основной посыл.')
,(N'Хип-хоп',N'музыкальный жанр, являющийся сочетанием ритмичной музыки и наложенным на неё речитативом, иногда — с наличием мелодичного куплета. Хип-хоп музыка является сочетанием двух музыкальных элементов субкультуры хип-хопа — диджеинга и эмсиинга.')
,(N'Джаз',N'это направление в музыке, которое возникло в США в самом начале XX века. В нем тесно переплетаются ритмы, обрядовые песнопения и рабочие песни афроамериканцев, а также гармоническая составляющая, присущая музыке белых переселенцев. Другими словами, это импровизационный жанр, появившийся в результате смешивания западноевропейской и западноафриканской музыки.')
,(N'Блюз',N'В основе блюза лежат спиричуэлсы (христианские песнопения), баллады, рабочие песни, традиционные песнопения различных племен и так далее. Непосредственно название «блюз» - это калька с английского словосочетания «blue devils» (в переводе обозначает «уныние, хандра»). Это медленная спокойная музыка, которая изначально была связана с историей афроамериканцев, их сложной жизни в США.')
,(N'Классика',N'Классические музыкальные произведения сочетают глубину, содержательность, идейную значительность с совершенством формы. К классической музыке могут быть отнесены как произведения, созданные в далёком прошлом, так и современные сочинения')
,(N'Рэгги',N'это едва ли не самая позитивная музыка после попа. Она отличается неспешным темпом и расслабленным ритмом. Исполнители зачастую пропускают сильные доли, акцентируя аккордами слабые. Ноты позитива вносит витиеватая басовая партия – посыл песни передаётся определённым ритмом.')
,(N'Детская',N'музыка, рассчитанная на прослушивание или исполнение детьми')
,(N'Шансон',N'Этот музыкальный жанр рассчитан на обычных людей. Темы, которые раскрываются в песнях, понятны и близки каждому. В них звучит боль и радость, переживания и удачи, любовь и дружба. Эти песни заставляют нас и плакать над обидами, и смеяться в радостные моменты жизни.')
go
create table Musics(
MusicId int primary key identity(1,1),
MusicName nvarchar(200) not null,
MusicFileName nvarchar(200) not null,
MusicUrl nvarchar(max) not null,
MusicImageName nvarchar(200) not null,
MusicImageUrl nvarchar(max) not null,
UserId int references Users(UserId) not null,
DateOfPublication datetime not null,
MusicGenreId int references MusicGenres(MusicGenreId) not null
)
go 
create table UsersMusics(
UserId int not null,
MusicId int not null,
Rating int,
Liked bit
primary key(UserId, MusicId),
foreign key (UserId) references Users(UserId) on delete cascade,
foreign key (MusicId) references Musics(MusicId) on delete cascade,
)
go
create table MusicComments(
IdComment uniqueidentifier primary key default newid(),
Comment nvarchar(max) not null,
CommentDate datetime not null,
UserId int references Users(UserId) on delete cascade not null,
MusicId int references Musics(MusicId) on delete cascade not null,
ParentIdComment uniqueidentifier
)
go
create table Playlists(
PlaylistId int primary key identity(1,1),
PlaylistName nvarchar(200) not null,
PlaylistDescription nvarchar(max),
PlaylistImageFile nvarchar(200) not null,
PlaylistImageUrl nvarchar(max) not null,
UserId int references Users(UserId) not null,
CreateDate datetime not null
)
go
create table PlaylistsMusics(
PlaylistId int not null,
MusicId int not null,
primary key (PlaylistId, MusicId),
foreign key (PlaylistId) references Playlists(PlaylistId) on delete cascade,
foreign key (MusicId) references Musics(MusicId) on delete cascade
)
go
create table Followers(
UserId int,
FollowedUserId int,
primary key (UserId, FollowedUserId),
foreign key (UserId) references Users(UserId),
foreign key (FollowedUserId) references Users(UserId),
check (FollowedUserId <> UserId)
)
go
create table Notifications(
NotificationId int primary key identity(1,1),
UserId int not null references Users(UserId),
SourceId int not null,
NotificationType int not null,
Message nvarchar(max) not null,
CreateDate datetime not null
)
go
create table UsersNotifications(
UserId int,
NotificationId int,
IsChecked bit,
primary key (UserId, NotificationId),
foreign key (UserId) references Users(UserId) on delete cascade,
foreign key (NotificationId) references Notifications(NotificationId) on delete cascade
)
go
create table Complaints(
ComplaintId int primary key identity(1,1),
ComplaintType int,
UserId int not null,
MusicId int not null,
Message nvarchar(max),
IsChecked bit,
CreateDate datetime,
foreign key (UserId) references Users(UserId) on delete cascade,
foreign key (MusicId) references Musics(MusicId) on delete cascade
)