using EmployeeDemo.Models;
using EmployeeDemo.Persistence;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EmployeeDemo.Controllers
{
    public class EmployeeController : Controller
    {
        // GET: Employee
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult EmployeeData() { return View(); }
        public JsonResult Country_Bind()
        {

            DataSet ds = EmpRepositery.Get_Country();
            List<SelectListItem> countryList = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {


                countryList.Add(new SelectListItem { Text = dr["CountryName"].ToString(), Value = dr["coRow_Id"].ToString() });

            }
            return Json(countryList, JsonRequestBehavior.AllowGet);

        }

        public JsonResult State_Bind(string country_id)
        {
            DataSet ds = EmpRepositery.Get_State(country_id);
            List<SelectListItem> statelist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                statelist.Add(new SelectListItem { Text = dr["StateName"].ToString(), Value = dr["sRow_Id"].ToString() });
            }
            return Json(statelist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult City_Bind(string state_id)
        {
            DataSet ds = EmpRepositery.Get_City(state_id);
            List<SelectListItem> citylist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                citylist.Add(new SelectListItem { Text = dr["CityName"].ToString(), Value = dr["cRow_Id"].ToString() });
            }
            return Json(citylist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Employee_Bind(string state_id)
        {
            DataSet ds = EmpRepositery.GetData();
            List<Employee> empList = new List<Employee>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                empList.Add(new Employee
                {
                    Row_Id = Convert.ToInt32(dr["eRow_Id"].ToString()),
                    FirstName = dr["FirstName"].ToString(),
                    LastName = dr["LastName"].ToString(),
                    EmailAddress = dr["EmailAddress"].ToString(),
                    PanNumber = dr["PanNumber"].ToString(),
                    PassportNumber = dr["PassportNumber"].ToString(),
                    CityName = dr["CityName"].ToString(),
                    CountryName = dr["CountryName"].ToString(),
                    StateName = dr["StateName"].ToString(),
                    ProfileImage = dr["ProfileImage"].ToString(),
                    MobileNumber = dr["MobileNumber"].ToString(),
                    strGender = dr["strGender"].ToString(),
                    strIsActive = dr["strIsActive"].ToString(),
                    Gender = Convert.ToInt32(dr["Gender"].ToString()),
                    CityId = Convert.ToInt32(dr["CityId"].ToString()),
                    StateId = Convert.ToInt32(dr["StateId"].ToString()),
                    CountryId = Convert.ToInt32(dr["CountryId"].ToString()),
                    DateOfBirth = dr["DateOfBirth"].ToString(),
                    DateOfJoinee = dr["DateOfJoinee"].ToString()
                    

                }); ;
            }
            return Json(empList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddEmployee(Employee obj)
        {
            int s = EmpRepositery.InsertData(obj);

            return RedirectToAction("Index");
        }

        [HttpPost]
        public ActionResult UpdateEmployee(Employee obj)
        {
            int s = EmpRepositery.UpdateData(obj);
            //return RedirectToAction("Index");

            return View();
        }



        [HttpPost]
        public ActionResult DeleteEmployee(int id)
        {
            int s = EmpRepositery.DeleteData(id);
            //return RedirectToAction("Index");
            return View();
            //return Json(s, JsonRequestBehavior.AllowGet);
        }


        public JsonResult CheckEmailAvailability(string emailId)
        {
            string s = EmpRepositery.CheckEmailAvailability(emailId);
            return Json(s, JsonRequestBehavior.AllowGet);

        }

        public JsonResult CheckMobileAvailability(string mobile)
        {
            string s = EmpRepositery.CheckMobileAvailability(mobile);
            return Json(s, JsonRequestBehavior.AllowGet);

        }

        public JsonResult CheckPassportAvailability(string Passport)
        {
            string s = EmpRepositery.CheckPassportAvailability(Passport);
            return Json(s, JsonRequestBehavior.AllowGet);

        }

        public JsonResult CheckPANAvailability(string PAN)
        {
            string s = EmpRepositery.CheckPANAvailability(PAN);
            return Json(s, JsonRequestBehavior.AllowGet);

        }

        
        public JsonResult UploadFile()
        {
            
            if (Request.Files.Count > 0)
            {
                try
                {
                    HttpFileCollectionBase files = Request.Files;

                    HttpPostedFileBase file = files[0];
                    string fileName = file.FileName;
                    string ext = Path.GetExtension(fileName);
                    // create the uploads folder if it doesn't exist
                    string fm = DateTime.Now.ToString("yyyyMMddHHmmssfff") + ext;
                    Directory.CreateDirectory(Server.MapPath("~/UploadedFiles/Employee"));
                    string path = Path.Combine(Server.MapPath("~/UploadedFiles/Employee"), fm);

                    // save the file
                    file.SaveAs(path);
                    return Json(fm,JsonRequestBehavior.AllowGet);
                }

                catch (Exception e)
                {
                    return Json(" ",JsonRequestBehavior.AllowGet);
                }
            }

            return Json("");
        
        }

    }
}