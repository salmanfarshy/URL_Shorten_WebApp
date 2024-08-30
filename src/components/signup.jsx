import { useEffect, useState } from "react";
import Error from "./error";
import { Input } from "./ui/input";
import * as Yup from "yup";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signup, login } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { UrlState } from "@/context";
import { useToast } from "@/components/ui/use-toast";

const Signup = () => {
  const { toast } = useToast();

  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [showImgName, setShowImgName] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setShowImgName(files[0]?.name);
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const { loading, error, fn: fnSignup, data } = useFetch(signup, formData);

  const {
    loading: loginLoading,
    error: loginError,
    fn: fnLogin,
    data: loginData,
  } = useFetch(login, { ...formData.email, ...formData.password });
  const { fetchUser } = UrlState();

  useEffect(() => {
    if (error === null && data) {
      fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, loading]);

  const handleSignup = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnSignup();
      await fnLogin();
      setShowImgName(null);
    } catch (error) {
      const newErrors = {};
      if (error?.inner) {
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });

        setErrors(newErrors);
      } else {
        setErrors({ api: error.message });
      }
    }
  };

  return (
    <Card>
      <CardHeader>{error && <Error message={error?.message} />}</CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <span className="font-semibold">Name</span>
          <Input
            name="name"
            type="text"
            placeholder="Enter Name"
            onChange={handleInputChange}
          />
        </div>
        {errors.name && <Error message={errors.name} />}
        <div className="space-y-1">
          <span className="font-semibold">Email</span>
          <Input
            name="email"
            type="email"
            placeholder="Enter Email"
            onChange={handleInputChange}
          />
        </div>
        {errors.email && <Error message={errors.email} />}
        <div className="space-y-1">
          <span className="font-semibold">Password</span>
          <Input
            name="password"
            type="password"
            placeholder="Enter Password"
            onChange={handleInputChange}
          />
        </div>
        {errors.password && <Error message={errors.password} />}
        <label className="space-y-1 p-4 bg-gray-900 w-full h-14 rounded-md flex justify-center items-center">
          <span className="font-bold text-base text-wrap">
            {showImgName ? showImgName : " Upload Image"}
          </span>
          <Input
            id="profile_pic"
            className="hidden"
            name="profile_pic"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
          />
        </label>
      </CardContent>
      <CardFooter>
        <Button
          className="md:w-auto w-full"
          onClick={() => {
            handleSignup();
            toast({
              variant: "success",
              description: "Account created successfully.",
              className:
                "bg-gray-800 font-extrabold top-4 md:right-10 right-6 fixed w-72",
              duration: "3000",
            });
          }}
        >
          {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Sign up"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;
