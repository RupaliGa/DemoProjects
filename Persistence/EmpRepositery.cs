using EmployeeDemo.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace EmployeeDemo.Persistence
{
    public class EmpRepositery
    {
        private static SqlConnection con=null;
        //To Handle connection related activities    
        private static void connection()
        {
            string constr = ConfigurationManager.ConnectionStrings["DB_Neo_Rupali"].ToString();
            con = new SqlConnection(constr);

        }
        public static DataSet Get_Country()
        {
            DataSet ds = new DataSet();
            connection(); 
            try
            {
                SqlCommand com = new SqlCommand("Select * from Country", con);
                com.CommandTimeout = 320;
                SqlDataAdapter da = new SqlDataAdapter(com);
                 
                da.Fill(ds);

               
            }
            catch (Exception ex) { }
            return ds;

        }
        //Get all State
        public static DataSet Get_State(string country_id)
        {
            connection();
            DataSet ds = new DataSet();
            try
            {
                SqlCommand com = new SqlCommand("Select * from State where CountryId=@catid", con);
                com.Parameters.AddWithValue("@catid", country_id);
                com.CommandTimeout = 320;
                SqlDataAdapter da = new SqlDataAdapter(com);

                da.Fill(ds);
            }
            catch(Exception ex) { }
            return ds;

        }

        //Get all City
        public static DataSet Get_City(string state_id)
        {
            DataSet ds = new DataSet();
            connection();
            try
            {
                SqlCommand com = new SqlCommand("Select * from City where StateId=@stateid", con);
                com.Parameters.AddWithValue("@stateid", state_id);
                com.CommandTimeout = 320;
                SqlDataAdapter da = new SqlDataAdapter(com);

                da.Fill(ds);
            }
            catch(Exception ex) { }
            return ds;

        }

        public static DataSet GetData() {
            try
            {

                connection();          
                SqlCommand com = new SqlCommand("stp_Emp_GetData", con);
                com.CommandType = CommandType.StoredProcedure;
                
                SqlDataAdapter da1 = new SqlDataAdapter(com);
            DataSet ds = new DataSet();
                
                da1.Fill(ds);
          

                return ds;
            }
            catch (Exception e)
            {

                throw;
            }
            finally
            {
                con.Close();
            }
            

        }


        public static int InsertData(Employee emp)
        {

            int s = 0;
            connection();
            SqlCommand com = new SqlCommand("stp_Emp_InseretData", con);
            com.CommandType = CommandType.StoredProcedure;
            com.Parameters.AddWithValue("@FirstName", emp.FirstName);
            com.Parameters.AddWithValue("@LastName", emp.LastName);
            com.Parameters.AddWithValue("@EmailAddress", emp.EmailAddress);
            com.Parameters.AddWithValue("@MobileNumber", emp.MobileNumber);
            com.Parameters.AddWithValue("@PanNumber", emp.PanNumber);
            com.Parameters.AddWithValue("@PassportNumber", emp.PassportNumber);
            com.Parameters.AddWithValue("@ProfileImage", emp.ProfileImage);
            com.Parameters.AddWithValue("@Gender", emp.Gender);
            com.Parameters.AddWithValue("@IsActive", emp.IsActive);
            com.Parameters.AddWithValue("@DateOfBirth", emp.DateOfBirth);
            com.Parameters.AddWithValue("@DateOfJoinee", emp.DateOfJoinee);
            com.Parameters.AddWithValue("@CountryId", emp.CountryId);
            com.Parameters.AddWithValue("@StateId", emp.StateId);
            com.Parameters.AddWithValue("@CityId", emp.CityId);    



            con.Open();
            s=com.ExecuteNonQuery();
            con.Close();
            return s;

        }

        public static int UpdateData(Employee emp)
        {

            int s = 0;
            connection();
            SqlCommand com = new SqlCommand("stp_Emp_UpdateData", con);
            com.CommandType = CommandType.StoredProcedure;
            com.Parameters.AddWithValue("@id", emp.Row_Id);
            com.Parameters.AddWithValue("@FirstName", emp.FirstName);
            com.Parameters.AddWithValue("@LastName", emp.LastName);
            com.Parameters.AddWithValue("@EmailAddress", emp.EmailAddress);
            com.Parameters.AddWithValue("@MobileNumber", emp.MobileNumber);
            com.Parameters.AddWithValue("@PanNumber", emp.PanNumber);
            com.Parameters.AddWithValue("@PassportNumber", emp.PassportNumber);
            com.Parameters.AddWithValue("@Gender", emp.Gender);
            com.Parameters.AddWithValue("@IsActive", emp.IsActive);
            com.Parameters.AddWithValue("@DateOfBirth", emp.DateOfBirth);
            com.Parameters.AddWithValue("@DateOfJoinee", emp.DateOfJoinee);
            com.Parameters.AddWithValue("@CountryId", emp.CountryId);
            com.Parameters.AddWithValue("@StateId", emp.StateId);
            com.Parameters.AddWithValue("@CityId", emp.CityId);



            con.Open();
            s = com.ExecuteNonQuery();
            con.Close();
            return s;

        }


        public static int DeleteData(int id)
        {

            int s = 0;
            connection();
            SqlCommand com = new SqlCommand("stp_Emp_DeleteData", con);
            com.CommandType = CommandType.StoredProcedure;
            com.Parameters.AddWithValue("@id", id); 



            con.Open();
            s = com.ExecuteNonQuery();
            con.Close();
            return s;

        }
        public static string CheckEmailAvailability(string emailId)
        {
            string result = "";
            connection();
                using (SqlCommand cmd = new SqlCommand("stp_Emp_CheckemailIDavailability", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@EmailId", emailId);
                    con.Open();
                    result = cmd.ExecuteScalar().ToString();
                    con.Close();
                }
            
            return result;
        }

        public static string CheckMobileAvailability(string mobile)
        {
            string result = "";
            connection();
            using (SqlCommand cmd = new SqlCommand("stp_Emp_CheckMobileAvailability", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Mobile", mobile);
                con.Open();
                result = cmd.ExecuteScalar().ToString();
                con.Close();
            }

            return result;
        }

        public static string CheckPassportAvailability(string Passport)
        {
            string result = "";
            connection();
            using (SqlCommand cmd = new SqlCommand("stp_Emp_CheckPassportAvailability", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Passport", Passport);
                con.Open();
                result = cmd.ExecuteScalar().ToString();
                con.Close();
            }

            return result;
        }

        public static string CheckPANAvailability(string PAN)
        {
            string result = "";
            connection();
            using (SqlCommand cmd = new SqlCommand("stp_Emp_CheckPANAvailability", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@PAN", PAN);
                con.Open();
                result = cmd.ExecuteScalar().ToString();
                con.Close();
            }

            return result;
        }




    }
}