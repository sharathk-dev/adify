import React, { useState, useEffect } from "react";
import {
    Box,
    Input,
    Text,
    Button,
    VStack,
    Flex,
    Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { login } from "../middlewares/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const validatePassword = (value) => value.length >= 6;

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    const handleLogin = async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            let token = "";
            if (JSON.parse(localStorage.getItem("user"))) {
                token  = JSON.parse(localStorage.getItem("user")).token;
            } else {
                console.log("No user data found in localStorage.");
            }
            const data = await login(email, password, token);
            navigate("/receipt/:locationId/:txnId");
        } catch (error) {
            setErrorMessage(error.message);
        } finally {z
            setIsLoading(false);
        }
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg="#F9FAFB" px={4}>
            <Box maxW="md" w="full" p={8} bg="white" rounded="md" boxShadow="lg" border="1px solid #E2E8F0">
                {/* Logo */}
                <Flex justify="left" mb={4}>
                    <Image src="/images/logo.jpg" alt="Metropolis Logo" h="70px" maxW="80%" objectFit="contain" />
                </Flex>

                {/* Horizontal line below the logo */}
                <Box borderBottom="1px solid gray" mb={4} />

                <Text fontSize="2xl" fontWeight="bold" mb={2}>
                    Parking without tickets or cash
                </Text>
                <Text fontSize="s" color="gray.500" mb={6}>
                    Whether this is your first time or you are back for another visit, let's start with your email.
                </Text>

                {/* Email Input */}
                <VStack align="start" spacing={1} mb={4}>
                    <Text fontSize="sm" fontWeight="medium">Email</Text>
                    <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        borderColor={email.length === 0 ? "gray.300" : isEmailValid ? "gray.300" : "red.400"}
                    />
                    {!isEmailValid && email.length > 0 && (
                        <Text fontSize="xs" color="red.500">Enter a valid email address</Text>
                    )}
                </VStack>

                {/* Password Input */}
                <VStack align="start" spacing={1} mb={6}>
                    <Text fontSize="sm" fontWeight="medium">Password</Text>
                    <Input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        borderColor={password.length === 0 ? "gray.300" : isPasswordValid ? "gray.300" : "red.400"}
                    />
                    {!isPasswordValid && password.length > 0 && (
                        <Text fontSize="xs" color="red.500">Password must be at least 6 characters</Text>
                    )}
                </VStack>

                {errorMessage && <Text color="red.500" fontSize="sm" mb={4}>{errorMessage}</Text>}

                {/* Login Button */}
                <Button
                    bg="#5F59FF"
                    w="full"
                    onClick={handleLogin}
                    isDisabled={!(isEmailValid && isPasswordValid) || isLoading}
                    opacity={!(isEmailValid && isPasswordValid) ? 0.5 : 1}
                    transition="opacity 0.2s ease-in-out"
                    isLoading={isLoading}
                >
                    Continue
                </Button>
            </Box>
        </Flex>
    );
};

export default Login;
