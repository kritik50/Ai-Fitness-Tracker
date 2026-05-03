export default {
    routes: [
        {
            method: "PUT",
            path: "/profiles/me",
            handler: "profile.updateMe",
            config: {
                policies: [],
            },
        },
    ],
};