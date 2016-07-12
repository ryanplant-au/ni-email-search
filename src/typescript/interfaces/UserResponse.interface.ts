export interface UserResponse {
    response: {
        status: string;
        user: {
            type: string;
            href: string;
            average_message_rating: {
                type: string;
                $: number;
            },
            average_rating: {
                type: string;
                $: number;
            },
            last_visit_time: {
                type: string;
                $: string;
            },
            email: {
                type: string;
                $: string;
            },
            registration_time: {
                type: string;
                $: string;
            },
            profiles: {
                profile: {
                    name: string;
                    type: string;
                    $: string;
                }[];
            },
            login: {
                type: string;
                $: string;
            }
            anonymous: {
                type: string;
                $: boolean;
            },
            registered: {
                type: string;
                $: boolean;
            },
            id: {
                type: string;
                $: number;
            },
            deleted: {
                type: string;
                $: boolean
            }
        }
    }
}