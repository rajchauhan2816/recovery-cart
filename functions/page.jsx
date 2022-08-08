/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { h, renderSSR } from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";
import { supabaseClient } from "../supabaseClient.ts";

const formatDate = (dateString) => {
    if (!dateString) {
        return ''
    }
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
}

function App({ notificationList }) {
    return (
        <html>
            <head>
                <title>Hello from JSX</title>
            </head>
            <body>
                <h1>Latest 20 Sent Notification</h1>
                <div>
                    <table>
                        <tr>
                            <th>Email</th>
                            <th>Recovery URL</th>
                            <th>Token</th>
                            <th>Recovered at</th>
                        </tr>
                        {notificationList.map((notification) => (
                            <div>
                                <tr>
                                    <td>{notification.email} | </td>
                                    <td>{notification.abandoned_checkouts.recovery_url} | </td>
                                    <td>{notification.abandoned_checkouts.token} | </td>
                                    <td>{formatDate(notification.abandoned_checkouts.recovered_at) || "None"}</td>
                                </tr>
                            </div>
                        ))}
                    </table>
                </div>
            </body>
        </html>
    );
}

export async function pagehandler(req) {
    // get 20 latest sent_notifications prefetched with abandoned_checkout_id
    const { data: notificationList, error } = await supabaseClient
        .from("sent_notifications")
        .select(`*,
        abandoned_checkouts(
            id,
            recovery_url,
            token,
            recovered_at
        )`)
        .order("id", { ascending: false })
        .limit(20);
    const html = renderSSR(<App notificationList={notificationList} />);
    return new Response(html, {
        headers: {
            "content-type": "text/html",
        },
    });
}