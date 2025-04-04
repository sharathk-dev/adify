import React, { useState, useEffect } from "react";
import { Box, Text, Image, Button, Flex } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { userDetails, trackAdView } from "../middlewares/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ReceiptPage = () => {
    const [isAdVisible, setIsAdVisible] = useState(true);
    const [user, setUser] = useState(null);
    const { locationId, txnId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                let data = JSON.parse(localStorage.getItem("user"));
                let userId = "";
                let token = "";
                if (data) {
                    userId = data.userId;
                    token = data.token;
                } else {
                    console.log("No user data found in localStorage.");
                }

                if (!userId) return;
                const userData = await userDetails(userId, token);
                if (userData) {
                    setUser(userData);

                    const location = userData.locationId?.toString();
                    const transaction = userData.transactionId;

                    if ((!locationId || !txnId) || (locationId !== location || txnId !== transaction)) {
                        navigate(`/receipt/${location}/${transaction}`, { replace: true });
                    }
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        fetchUser();
    }, []);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const sendAdEvent = async (adId, isClicked) => {
        if (!user) return;

        const payload = {
            transactionId: user.transactionId || "1",
            isClicked,
            adId: adId || "1",
            memberId: user.memberId || "1",
        };
        try {
            let token = "";
            const localData = JSON.parse(localStorage.getItem("user"));
            if (localData) {
                token = localData.token;
            } else {
                console.log("No user data found in localStorage.");
            }
            await trackAdView(payload, token);
            console.log(`Ad ${isClicked ? "click" : "view"} tracked successfully:`, payload);
        } catch (error) {
            console.error(`Error tracking ad ${isClicked ? "click" : "view"}:`, error);
        }
    };

    useEffect(() => {
        if (isAdVisible && user?.recommendations?.length > 0) {
            user.recommendations.forEach(ad => sendAdEvent(ad.id, 0));
        }
    }, [isAdVisible, user]);

    const ads = user?.recommendations || [];
    const defaultImage = "https://mir-s3-cdn-cf.behance.net/project_modules/2800_opt_1/cca71160275449.5a46380807b12.jpg";

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: ads.length > 3,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: false,
    };

    return (
        <Box minH="100vh" display="flex" justifyContent="center" alignItems="center" bgGradient="linear(to-br, #2D0C57, #8A2387)">

            <Box
                bg="white"
                p={0}
                rounded="2xl"
                shadow="2xl"
                maxW="md"
                w="full"
                borderColor="#5A189A"
                overflow="hidden"
                position="relative"
            >
                {/* Back Arrow Image */}
                <Image
                    src="https://icons.veryicon.com/png/o/miscellaneous/night-hunting/android-arrow-back.png"
                    alt="Back"
                    onClick={() => navigate("/login")}
                    position="absolute"
                    top="16px"
                    left="16px"
                    boxSize="32px"
                    cursor="pointer"
                    _hover={{ opacity: 0.8 }}
                    zIndex="10"
                />

                {/* Logo */}
                <Flex justify="center" mt={4} mb={0}>
                    <Image
                        src="/images/successLogo.jpg"
                        alt="Metropolis Logo"
                        h="130px"
                        maxW="95%"
                        objectFit="contain"
                    />
                </Flex>

                <Box p={0} textAlign="center" mt={0}>
                    <Text fontSize="2xl" fontWeight="bold" color="black">
                        <b>Thank You!</b>
                    </Text>
                </Box>
                <Box p={8}>
                    <Text color="gray.600" mt={2} textAlign="center">
                        Details of your parking at <b>{user?.locationName}</b>
                    </Text>

                    <Box mt={4} color="gray.700">
                        <Flex justifyContent="space-between">
                            <Text fontWeight="bold">License Plate</Text>
                            <Text>{user?.licensePlate || "ABC002"}</Text>
                        </Flex>
                        <Flex justifyContent="space-between">
                            <Text fontWeight="bold">Entered At</Text>
                            <Text>{user?.entryTime ? formatDate(user.entryTime) : "N/A"}</Text>
                        </Flex>
                        <Flex justifyContent="space-between">
                            <Text fontWeight="bold">Exited At</Text>
                            <Text>{user?.exitTime ? formatDate(user.exitTime) : "N/A"}</Text>
                        </Flex>
                    </Box>

                    <Button
                        w="full"
                        bg="#F5F2FF"
                        color="black"
                        py={2}
                        px={4}
                        mt={4}
                        mb={3}
                        border="1px solid"
                        borderColor="#E0D6FF"
                        borderRadius="md"
                        fontWeight="medium"
                        _hover={{ bg: "#EDEAFF" }}
                    >
                        Paid with Apple Pay
                        <Image
                            src="https://img.icons8.com/m_sharp/512/mac-os.png"
                            alt="Apple Pay"
                            h="20px"
                            mr={4}
                        />
                    </Button>


                    {isAdVisible && ads.length > 0 && (
                        <Box mt={4} w="full">
                            <Slider {...sliderSettings}>
                                {ads.map((ad, index) => (
                                    <Box key={index} position="relative">
                                        <a
                                            href={ad.adUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => sendAdEvent(ad.id, 1)}
                                        >
                                            <Image
                                                src={ad.imageUrl || defaultImage}
                                                alt={`Ad ${index + 1}`}
                                                w="full"
                                                h={40}
                                                objectFit="cover"
                                                cursor="pointer"
                                            />
                                        </a>
                                        <Button
                                            size="s"
                                            position="absolute"
                                            top={1}
                                            right={1}
                                            color="gray.700"
                                            bg="gray.200"
                                            _hover={{ bg: "gray.300" }}
                                            _active={{ bg: "gray.400" }}
                                            onClick={() => {
                                                setIsAdVisible(false);
                                                sendAdEvent(ad.id, 1);
                                            }}
                                        >
                                            ✕
                                        </Button>
                                    </Box>
                                ))}
                            </Slider>
                        </Box>
                    )}

                    <Box borderBottom="2px solid" borderColor="#5F59FF" my={5} />
                    <Box color="gray.700">
                        <Flex justifyContent="space-between">
                            <Text>Parking</Text>
                            <Text>${user?.totalAmount || "0.00"}</Text>
                        </Flex>
                        <Flex justifyContent="space-between">
                            <Text>Service Fee</Text>
                            <Text>${user?.fee || "0.00"}</Text>
                        </Flex>
                        <Flex justifyContent="space-between">
                            <Text>Discount</Text>
                            <Text>-$0.00</Text>
                        </Flex>
                        <Flex justifyContent="space-between" fontWeight="bold" color="#5A189A">
                            <Text>Total</Text>
                            <Text>${user?.paidAmount || "0.00"}</Text>
                        </Flex>
                        <Text fontSize="xs" color="gray.500" mt={2}>*Includes state and local taxes of $0.00</Text>
                    </Box>

                    <Button bg="#5F59FF" color="white" mt={5} w="full" size="lg" fontWeight="bold" _hover={{ bg: "#7B2CBF" }}>
                        Find your receipt
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ReceiptPage;
