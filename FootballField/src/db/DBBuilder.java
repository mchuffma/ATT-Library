package db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * This class is used to set up the database backend for our application. It sets up the tables 
 * inside the database and goes through and dynamically adds data to it, every time the addData() 
 * method is called. This is used to set up the database.
 * 
 * @author dfperry2
 *
 */
public class DBBuilder {

	/**
	 * @param args
	 */
	private static PreparedStatement ps;
	static Connection conn;

	/**
	 * A constructor to create an instance of the DBBuilder using a specific
	 * connection that is passed in.
	 * @param conn The connection to the database that we are going to build these
	 * tables in.
	 */
	public DBBuilder(Connection conn){
		this.conn = conn;
	}
	
	/**
	 * A method that could be more aptly named makeTables(). However, it creates the tables
	 * inside the datasource described in the content.xml file. This table, called people, has 
	 * specific fields that are referenced throughout the application.
	 */
	public void makeDatabase() {
		List<String> query = new ArrayList<String>();
		//String makeDb = "CREATE DATABASE IF NOT EXISTS footballfield";
		//String useDb = "use footballfield";
		String makeTable = "CREATE TABLE IF NOT EXISTS people (" + 
				"pid int(11) NOT NULL AUTO_INCREMENT," +
				"entering int(11) NOT NULL," +
				"eventTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
				"PRIMARY KEY (`pid`)" +
				") ENGINE=InnoDB DEFAULT CHARSET=utf8";
		//query.add(makeDb);
		//query.add(useDb);
		query.add(makeTable);
		for(int i = 0; i< query.size(); i++){
			try {
				ps = conn.prepareStatement(query.get(i));
				ps.execute();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	/**
	 * A function that adds 5 rows of data to the database. One day, this will hopefully be connected
	 * to an arduino system. However, for now, it just randomly picks the number 1 or 0. If the number is 1, 
	 * the person is said to be entering the database, if it is 0 the person is exiting. This data is then 
	 * added to the database.
	 */
	public void addData() {
		String si = "INSERT INTO people(entering) VALUES (?)";
		PreparedStatement ps;
		int j;
		for(int i = 0; i < 5; i++) {
			Random rand = new Random();	
			j = rand.nextInt(2);
			try {
				ps = conn.prepareStatement(si);
				ps.setInt(1, j);
				ps.execute();
				//System.out.println(ps.toString());
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
	}

}
