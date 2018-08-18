# DemoApp

<p><h2>Description:</h2>Demo app developed for Play N Go to demonstrate my coding capabilities.</p>

<h2>Tech Stack:</h2>
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

<h2>Features:</h2>
<ul>
  <li>Uses Identity Framework to authenticate and manage user sign up and login</li>
  <li>Uses JWT to authorize HTTP requests that requires security. The token is derived from an APP KEY defined in the server plus the user's Identity Id</li>
  <li>All Users and Games are saved on MS SQL DB to persist the data</li>
  <li>Public message board where users can post topics and comments. All posts are saved using Entity Framework Core.</li>
  <li>Mini Games: Higher/Lower and Get Higher</li>
  <li>SignalR is implemented to support real-time updates on board posts and comments. All users connected to the board receives update in real-time</li>
</ul>

<h2>Partially implemented:</h2>
<ul>
  <li>Stored Procedures for MS SQL</li>
  <li>Authentication of HTTP Request by sending JWT as part of the header</li>
  <li>MD5 Hash algorithm using the JWT + API_KEY to authenticate if the HTTP request is not tampered upon transport</li>
</ul>

<h2>Pending:</h2>
<ul>
  <li>Password encryption on MS SQL</li>
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
          <li>Run the server locally by clicking the <b>IIS Express</b> green button below the menu bar. When the server is ready, it will open your default browser and will navigate to the its default URL e.g. <b>http://localhost:52162/api/values</b>. Please note this down as you will need to configure it on the front-end app.</li>
        </ul>
      </li>
    </ol>
  </li>
  <li><h3>Front End</h3></li>
</ol>
