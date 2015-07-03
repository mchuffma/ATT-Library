import java.io.IOException;
import java.io.PrintWriter;
import javax.naming.InitialContext;
import javax.servlet.http.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.sql.DataSource;
import db.DBBuilder;
import java.sql.*;
import java.util.Date;

/**
 * Servlet implementation class WebClassServlet. 
 * This class is used to act as a 
 * web server (or Java Servlet) and essentially acted as a go-between between the Web
 * Application and the database. This class is what allows us to dynamically, and securely,
 * update our web application.
 * 
 * @author dfperry2
 * @author mchuffma
 */
@WebServlet("/WebClassServlet/*")
public class WebClassServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final int MAX_CAPACITY = 100;
	private int numOfPeople;
    private Connection conn; 
    private static final String SELECT_STATEMENT = "SELECT entering FROM People WHERE timediff(eventTime,?) > 0";
    PreparedStatement select = null;
    private DBBuilder db;
	/**
     * Default constructor. Used to create and initialize the WebClass Servlet.
     * In this method, it gets a connection to a database (set up by the Content.xml), which is 
     * considered the datasource. It then uses the DB Builder class to create the table in the database,
     * and set the project up for advancement.
     * 
     * @param There are none.
     */
    public WebClassServlet() {
    	
    	conn = getConnection();
    	db = new DBBuilder(conn);
    	db.makeDatabase();
    }

	/**
	 * A method to respond to the ajax "GET" type coming from the JavaScript. This method
	 * takes in a HttpServletRequest (request) from the javascript, and responds with an 
	 * HTTPServletResponse (response). The response, in this case, is of the JSON type. It returns
	 * the current time, and the number of people entering or exiting to the calling javascript.
	 * 
	 * @param request - The request sent from the JavaScript on the webpage to the servlet. This often contains data 
	 * 	and in this case it contains the last time the webapp called to the servlet.
	 * @param response - The response sent from the servlet back to the JavaScript.
	 * 
	 * @throws ServletException : This exception is thrown when there is an error in the servlet
	 * @throws IOException: This exception is thrown when there is an error writing back to the JavaScript/Web Applicaton.
	 * 
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		String time = request.getParameter("time");
		long temp = Long.parseLong(time);
		db.addData();
		getEnteringExiting(temp);
		response.setContentType("text/json");
		String jsonStr = "{\"numOfPeople\": \"" + numOfPeople + "\" , "
				+ "\"time\": \"" + new Date().getTime() + "\"}"; 
				
		PrintWriter out = response.getWriter();
		out.write(jsonStr);
		
	}

	/**
	 * This method is required for this class to be a fully functioning servlet, however
	 * for this project it is not used, and is just a stub.
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}
	
	/**
	 * A private method that uses the DataSource declared in the context.xml to create a new
	 * datasource - the local MySQL database. It then returns this connection. The connection created
	 * here is used for all future database interaction within the application.
	 * 
	 * @return the connection used to talk to the database throughout the rest of the application.
	 */
	private Connection getConnection(){
		try {
			InitialContext ic = new InitialContext();
			DataSource ds = (DataSource) ic.lookup("java:/comp/env/jdbc/footballfield");
			if(ds == null){
				System.out.println("Error with DataSource");
			}
			return ds.getConnection();
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * A private method used to figure out the number of people that have entered or exited between
	 * the current time and the last time that the web application asked for that information. It returns 
	 * the total number of people. If the return value is negative it means that more people left than entered,
	 * and if it is positive it means more people entered than exited.
	 * @param oldDate : The long representation of the last time (in milliseconds) that the Web Application asked the
	 * 	servlet to query the database.
	 * @return numOfPeople the net number of people entering or exiting the library in that period.
	 */
	
	private int getEnteringExiting(long oldDate){
		
		int entering=0 , exiting =0;
		try{
    		select = conn.prepareStatement(SELECT_STATEMENT);
    		java.sql.Timestamp date = new java.sql.Timestamp(oldDate);
    		select.setTimestamp(1, date);
    		ResultSet rs = select.executeQuery();
    		while(rs.next()){
    			int i = rs.getInt("entering");
    			if(i == 1){
    				entering++;
    			}
    			else{
    				exiting++;
    			}
    		}
    		
    		numOfPeople =  entering - exiting;
    	}catch(SQLException se){
    		System.out.println("SQL Error");
    	}
		return numOfPeople;
	}
}
