# DemoApp

<p><h2>Description:</h2>Demo app developed for Play N Go to demonstrate my coding capabilities.</p>

<h2>Tech Stack</h2>
Front-end:
<ul>
  <li><strong>Ionic/Angular</strong></li>
</ul>
Back-end:
<ul>
  <li><strong>ASP.NET Core 2.1</strong></li>
  <li><strong>MS SQL Server</strong></li>
  <li><strong>SignalR</strong></li>
</ul>

<h2>Features</h2>
<ul>
  <li>Uses Identity Framework to authenticate and manage user sign up and login</li>
  <li>Uses JWT to authorize HTTP requests that requires security. The token is derived from an APP KEY defined in the server plus the user's Identity Id</li>
  <li>All Users and Games are saved on MS SQL DB to persist the data</li>
  <li>Public message board where users can post topics and comments. All posts are saved using Entity Framework Core.</li>
  <li>Mini Games: High/Low and Higher</li>
  <li>SignalR is implemented to support real-time updates on board posts and comments. All users connected to the board receives update in real-time</li>
</ul>

<h2>Partially implemented</h2>
<ul>
  <li>Stored Procedures for MS SQL</li>
  <li>Authentication of HTTP Request by sending JWT as part of the header</li>
  <li>MD5 Hash algorithm using the JWT + API_KEY to authenticate if the HTTP request is not tampered upon transport</li>
</ul>

<h2>Pending stuffs and Limitations</h2>
<ul>
  <li>HTTPS support is disabled on the server because CORS doesn't work properly on Firefox if it is enabled</li>
  <li>Password encryption on MS SQL</li>
  <li>Deleting of a board while users are connected will cause an error</li>
  <li>Comments on the code are not extensive and only done on important parts to save time</li>
</ul>

<h2>Installation</h2>
<ol>
  <li>
    <h3>Back End</h3>
    <ol>
      <li>
        <h4>Create the database</h4>
        <ul>
          <li>Using MS SQL Server Studio and create a new DB instance. Enter a <b>Server Name</b> e.g. CODETRIBE and set <b>Authentication</b> to <b>Windows Authentication</b></li>
          <li>Then, on the Object Explorer panel, right click the <b>Databases</b> folder and select <b>New Database</b></li>
          <li>Create a database named <b>omnidb</b> and note down the connection settings</li>
          <li>Open the project folder <b>DemoApp/resources/</b> and open the SQL files using a text editor</li>
          <li>Create the tables by executing the SQL statements on MS SQL Server Studio</li>
          <li>Don't forget to run the <b>INSERT</b> statements as well to create the table data</li>
        </ul>
      </li>
      <li>
        <h4>Run the Local Server</h4>
        <ul>
          <li>Open the solution <b>DemoApp/DemoServer/DemoServer.sln</b> using Visual Studio 2017</li>
          <li>Open the file <b>DemoApp/DemoServer/DemoServer/appsettings.json</b></li>
          <li>Update the node <b>LocalDbConnectionString</b> and enter the <b>Server Name</b> and <b>Database Name</b> of the DB instance that you have created on the previous step</li>
          <li>By default, the server will run on port <b>52162</b>. If you want to change it, just modify the file <b>DemoApp/DemoServer/DemoServer/Properties/launchSettings.json</b>. If you do, please take note of the port number as you will need to configure this on the front-end app as well</li>
          <li>Run the server locally by clicking the <b>IIS Express</b> green button below the menu bar. When the server is ready, it will open your default browser and will navigate to the its default URL e.g. <b>http://localhost:52162/api/values</b>. Please note this down as you will need to configure it on the front-end app</li>
        </ul>
      </li>
    </ol>
  </li>
  <li>
    <h3>Front End</h3>
    <ol>
      <li>
        <h4>Setup the Client</h4>
        <ul>
          <li>Open the project folder <b>DemoApp/demoapp/</b> using Visual Studio Code or your favorite Angular IDE</li>
          <li>Open the file <b>DemoApp/demoapp/src/providers/web-service/web-service.ts</b></li>
          <li>Go to <b>Line #6</b> and make sure that the endpoint URL and port number matches the <b>Local Server URL</b> (see Run the Local Server section for details) e.g. <b>http://localhost:52162/</b></li>
        </ul>
      </li>
      <li>
        <h4>Run the Client App</h4>
        <ul>
          <li>Open your shell program e.g. Power Shell or Git Bash and navigate to the client app folder <b>DemoApp/demoapp/</b></li>
          <li><b>(OPTIONAL)</b> Install the <b>Ionic Framework</b> by typing <b>npm install -g ionic@latest cordova</b> on the command prompt and then just follow the instructions</li>
          <li>Once Ionic Framework is installed, start the client app by typing <b>ionic serve</b> on the command prompt. This will launch your default browser and open the app as an Angular application</li>
          <li><b>(OPTIONAL)</b> The app works on any screen resolution but the layout works best on a portrait orientation. Resize your browser to simulate a mobile device or open the developer console on your browser</li>
          <li><b>(OPTIONAL)</b> Open a different browser and navigate to the same <b>Client App URL</b>. This will enable you to have two instances of the app and login as two different users</li>
        </ul>
      </li>
      <li>
        <h4>Test the Client App</h4>
        <ul>
          <li>Click <b>REGISTER</b> on the welcome screen and fill up the credentials</li>
          <li>Once logged in, go to the <b>GAMES</b> tab and select a game to play</li>
          <li>On any of the two games provided, you can select your bet by clicking the popup list</li>
          <li>The two available games are straight-forward and self-explanatory</li>
          <li>To test the <b>SignalR</b> functionality, go to the <b>BOARDS</b> section and create a new board</li>
          <li>If you have another instance of the app opened on another browser, the newly created board will be listed there as well in real-time. If the board is updated or deleted by the owner, it will be updated on both clients</li>
          <li>Open a board and click the <b>Chat Bubble</b> icon. This will open the board and connected users can start chatting in real-time. Hyperlinks are supported on the chat messages</li>
          <li>The rest of the application features like <b>MENU</b> and <b>SEARCH</b> are self-explanatory</li>
        </ul>
      </li>
    </ol>
  </li>
  <li>
    <h3>Final Notes</h3>
    <p>That's it! Enjoy the app and I hope that I have fulfilled all the requirements of this tech exam</p>
  </li>
</ol>
