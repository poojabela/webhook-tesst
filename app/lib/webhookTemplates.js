/**
 * Webhook Templates Library
 * 
 * Contains predefined payload templates for popular webhook providers.
 * Each template is structured based on actual webhook formats from these services.
 */

export const webhookTemplates = {
  // Stripe payment webhooks
  stripe: {
    payment_intent_succeeded: {
      id: "evt_1NpTiQKZ6qxOkwYlnnKZgJeZ",
      object: "event",
      api_version: "2023-10-16",
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: "pi_" + Math.random().toString(36).substring(2, 12),
          object: "payment_intent",
          amount: 2000,
          amount_received: 2000,
          currency: "usd",
          payment_method: "pm_" + Math.random().toString(36).substring(2, 12),
          payment_method_types: ["card"],
          status: "succeeded",
          customer: "cus_" + Math.random().toString(36).substring(2, 12),
          description: "Payment for order #1234",
          metadata: {
            order_id: "ord_" + Math.random().toString(36).substring(2, 10)
          },
          created: Math.floor(Date.now() / 1000) - 60,
        }
      },
      type: "payment_intent.succeeded",
      livemode: false
    },
    payment_intent_failed: {
      id: "evt_1NpTiQKZ6qxOkwYlaaGHnJeZ",
      object: "event",
      api_version: "2023-10-16",
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: "pi_" + Math.random().toString(36).substring(2, 12),
          object: "payment_intent",
          amount: 2000,
          currency: "usd",
          payment_method: "pm_" + Math.random().toString(36).substring(2, 12),
          payment_method_types: ["card"],
          status: "failed",
          customer: "cus_" + Math.random().toString(36).substring(2, 12),
          description: "Payment for order #1234",
          last_payment_error: {
            code: "card_declined",
            message: "Your card was declined.",
            type: "card_error"
          },
          metadata: {
            order_id: "ord_" + Math.random().toString(36).substring(2, 10)
          },
          created: Math.floor(Date.now() / 1000) - 60,
        }
      },
      type: "payment_intent.failed",
      livemode: false
    },
    customer_subscription_created: {
      id: "evt_1NpTiQKZ6qxOkwYlppTYgJeZ",
      object: "event",
      api_version: "2023-10-16",
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: "sub_" + Math.random().toString(36).substring(2, 12),
          object: "subscription",
          status: "active",
          customer: "cus_" + Math.random().toString(36).substring(2, 12),
          current_period_start: Math.floor(Date.now() / 1000),
          current_period_end: Math.floor(Date.now() / 1000) + 2592000, // + 30 days
          items: {
            data: [
              {
                id: "si_" + Math.random().toString(36).substring(2, 12),
                price: {
                  id: "price_" + Math.random().toString(36).substring(2, 12),
                  product: "prod_" + Math.random().toString(36).substring(2, 12),
                  active: true,
                  currency: "usd",
                  unit_amount: 1500
                },
                quantity: 1
              }
            ],
          },
          metadata: {
            user_id: "user_" + Math.random().toString(36).substring(2, 10)
          },
          created: Math.floor(Date.now() / 1000),
        }
      },
      type: "customer.subscription.created",
      livemode: false
    }
  },
  
  // GitHub webhook events
  github: {
    push: {
      ref: "refs/heads/main",
      before: "6113728f27ae82c7b1a177c8d03f9e96e0adf246",
      after: "59b20b8d5c6ce8d0f1c9b7b86c824e0a05306619",
      repository: {
        id: 1296269,
        node_id: "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
        name: "Hello-World",
        full_name: "octocat/Hello-World",
        owner: {
          name: "octocat",
          email: "octocat@example.com",
          login: "octocat",
          id: 1,
          node_id: "MDQ6VXNlcjE=",
          avatar_url: "https://github.com/images/error/octocat_happy.gif",
          url: "https://api.github.com/users/octocat"
        },
        html_url: "https://github.com/octocat/Hello-World",
        description: "This your first repo!",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        pushed_at: new Date().toISOString()
      },
      pusher: {
        name: "octocat",
        email: "octocat@example.com"
      },
      sender: {
        login: "octocat",
        id: 1,
        node_id: "MDQ6VXNlcjE=",
        avatar_url: "https://github.com/images/error/octocat_happy.gif",
        url: "https://api.github.com/users/octocat"
      },
      commits: [
        {
          id: "59b20b8d5c6ce8d0f1c9b7b86c824e0a05306619",
          message: "Fix all the bugs",
          timestamp: new Date().toISOString(),
          author: {
            name: "Octocat",
            email: "octocat@example.com",
            username: "octocat"
          },
          url: "https://github.com/octocat/Hello-World/commit/59b20b8d5c6ce8d0f1c9b7b86c824e0a05306619"
        }
      ],
      head_commit: {
        id: "59b20b8d5c6ce8d0f1c9b7b86c824e0a05306619",
        message: "Fix all the bugs",
        timestamp: new Date().toISOString(),
        author: {
          name: "Octocat",
          email: "octocat@example.com",
          username: "octocat"
        },
        url: "https://github.com/octocat/Hello-World/commit/59b20b8d5c6ce8d0f1c9b7b86c824e0a05306619"
      }
    },
    pull_request: {
      action: "opened",
      number: 1,
      pull_request: {
        url: "https://api.github.com/repos/octocat/Hello-World/pulls/1",
        id: 1,
        node_id: "MDExOlB1bGxSZXF1ZXN0MQ==",
        html_url: "https://github.com/octocat/Hello-World/pull/1",
        state: "open",
        title: "Amazing new feature",
        user: {
          login: "octocat",
          id: 1,
          node_id: "MDQ6VXNlcjE=",
          avatar_url: "https://github.com/images/error/octocat_happy.gif",
          url: "https://api.github.com/users/octocat"
        },
        body: "Please pull these awesome changes in!",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        head: {
          label: "octocat:new-feature",
          ref: "new-feature",
          sha: "6113728f27ae82c7b1a177c8d03f9e96e0adf246"
        },
        base: {
          label: "octocat:main",
          ref: "main",
          sha: "6dcb09b5b57875f334f61aebed695e2e4193db5e"
        }
      },
      repository: {
        id: 1296269,
        node_id: "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
        name: "Hello-World",
        full_name: "octocat/Hello-World",
        owner: {
          login: "octocat",
          id: 1,
          avatar_url: "https://github.com/images/error/octocat_happy.gif"
        }
      },
      sender: {
        login: "octocat",
        id: 1,
        node_id: "MDQ6VXNlcjE=",
        avatar_url: "https://github.com/images/error/octocat_happy.gif"
      }
    }
  },
  
  // Shopify webhook events
  shopify: {
    order_created: {
      id: 820982911946154000,
      email: "jon@example.com",
      closed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      number: 234,
      note: null,
      token: "123456abcd",
      gateway: "authorize_net",
      test: true,
      total_price: "409.94",
      subtotal_price: "398.00",
      total_tax: "11.94",
      currency: "USD",
      financial_status: "paid",
      confirmed: true,
      total_discounts: "0.00",
      total_line_items_price: "398.00",
      cart_token: "68778783ad298f1c80c3bafcddeea",
      buyer_accepts_marketing: false,
      name: "#9999",
      referring_site: null,
      landing_site: null,
      cancelled_at: null,
      cancel_reason: null,
      total_price_usd: "409.94",
      checkout_token: "bd5a8aa1ecd019dd3520ff791ee3a24c",
      reference: null,
      user_id: null,
      location_id: null,
      source_identifier: null,
      source_url: null,
      processed_at: new Date().toISOString(),
      device_id: null,
      browser_ip: null,
      landing_site_ref: null,
      order_number: 1234,
      discount_codes: [],
      note_attributes: [],
      payment_gateway_names: [
        "authorize_net"
      ],
      processing_method: "direct",
      checkout_id: 901414060,
      source_name: "web",
      tax_lines: [
        {
          price: "11.94",
          rate: 0.03,
          title: "State Tax"
        }
      ],
      tags: "",
      contact_email: "jon@example.com",
      line_items: [
        {
          id: 866550311766439000,
          variant_id: 808950810,
          title: "Electric Toothbrush",
          quantity: 1,
          price: "199.00",
          sku: "IPOD2008PINK",
          variant_title: "Pink",
          vendor: "Apple",
          fulfillment_service: "manual",
          product_id: 788032119,
          requires_shipping: true,
          taxable: true,
          gift_card: false,
          name: "Electric Toothbrush - Pink",
          variant_inventory_management: "shopify",
          properties: [],
          product_exists: true,
          fulfillable_quantity: 1,
          grams: 567,
          total_discount: "0.00",
          fulfillment_status: null,
          tax_lines: [
            {
              price: "3.98",
              rate: 0.02,
              title: "State Tax"
            }
          ]
        },
        {
          id: 704639321,
          variant_id: 457924702,
          title: "Premium Toothpaste",
          quantity: 1,
          price: "199.00",
          sku: "IPOD2008BLACK",
          variant_title: "Premium",
          vendor: "Apple",
          fulfillment_service: "manual",
          product_id: 788032119,
          requires_shipping: true,
          taxable: true,
          gift_card: false,
          name: "Premium Toothpaste - Premium",
          variant_inventory_management: "shopify",
          properties: [],
          product_exists: true,
          fulfillable_quantity: 1,
          grams: 567,
          total_discount: "0.00",
          fulfillment_status: null,
          tax_lines: [
            {
              price: "3.98",
              rate: 0.02,
              title: "State Tax"
            }
          ]
        }
      ],
      shipping_lines: [
        {
          id: 271878346,
          title: "Generic Shipping",
          price: "10.00",
          code: "INT.TP",
          source: "shopify",
          phone: null,
          tax_lines: [
            {
              price: "0.30",
              rate: 0.03,
              title: "State Tax"
            }
          ]
        }
      ],
      billing_address: {
        first_name: "Bob",
        last_name: "Norman",
        address1: "Chestnut Street 202",
        address2: "",
        city: "Louisville",
        province: "Kentucky",
        country: "United States",
        zip: "40202",
        phone: "555-625-1199",
        name: "Bob Norman",
        province_code: "KY",
        country_code: "US",
        country_name: "United States",
        default: true
      },
      shipping_address: {
        first_name: "Bob",
        last_name: "Norman",
        address1: "Chestnut Street 202",
        address2: "",
        city: "Louisville",
        province: "Kentucky",
        country: "United States",
        zip: "40202",
        phone: "555-625-1199",
        name: "Bob Norman",
        province_code: "KY",
        country_code: "US",
        country_name: "United States",
        default: true
      },
      customer: {
        id: 115310627,
        email: "bob.norman@hostmail.com",
        accepts_marketing: false,
        created_at: "2013-04-23T13:36:50-04:00",
        updated_at: "2021-04-23T13:36:50-04:00",
        first_name: "Bob",
        last_name: "Norman",
        orders_count: 1,
        state: "disabled",
        total_spent: "41.94",
        last_order_id: 450789469,
        note: null,
        verified_email: true,
        multipass_identifier: null,
        tax_exempt: false,
        phone: "+16135551111",
        tags: "",
        last_order_name: "#1001",
        default_address: {
          id: 715243470,
          customer_id: 115310627,
          first_name: null,
          last_name: null,
          company: null,
          address1: "Chestnut Street 202",
          address2: null,
          city: "Louisville",
          province: "Kentucky",
          country: "United States",
          zip: "40202",
          phone: "555-625-1199",
          name: "",
          province_code: "KY",
          country_code: "US",
          country_name: "United States",
          default: true
        }
      }
    }
  },
  
  // Slack webhook events
  slack: {
    message_sent: {
      token: "ZZZZZZWSxiZZZ2yIvs3peJ",
      team_id: "T123ABC456",
      api_app_id: "A123ABC456",
      event: {
        type: "message",
        subtype: "bot_message",
        text: "Hello, World!",
        ts: "1578433527.000400",
        username: "NotificationBot",
        bot_id: "B123ABC456",
        channel: "C123ABC456",
        event_ts: "1578433527.000400",
        channel_type: "channel"
      },
      type: "event_callback",
      event_id: "Ev123ABC456",
      event_time: Math.floor(Date.now() / 1000),
      authed_users: ["U123ABC456"]
    }
  }
}; 