#!/usr/bin/env python3
"""
TheBhom Community Deal Sniper & Quick Reply Generator
Helps post helpful, non-spam recommendations into top Telegram discussion groups.
"""

import os
import re
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEALS_DIR = os.path.join(BASE_DIR, 'deals', 'p')
SITE_URL = "https://thebhom.in"

TOP_GROUPS = [
    {"name": "DesiDime Shopping Gang", "handle": "desidime", "desc": "India's #1 shopping forum with in-post comments"},
    {"name": "MasterTricky Deals (MTD)", "handle": "Earticledeal", "desc": "3.5L+ members, high-frequency gadget discussions"},
    {"name": "CoolzTricks Official", "handle": "icoolzTricks", "desc": "Loot glitches and 80% off discussions"},
    {"name": "GrabOn India Official", "handle": "GrabOnIndiaOfficial", "desc": "Coupon codes and flash sales"},
    {"name": "IndiaFreeStuff Deals", "handle": "indiafreestuffdeals", "desc": "Fashion, sneakers and lifestyle offers"},
    {"name": "FreeKaaMaal Official", "handle": "freekaamaal_official", "desc": "Discount vouchers and store deals"},
    {"name": "Shopping Looters Chat", "handle": "shoppinglooterschat", "desc": "Open discussion chat for deal hunters"}
]

TEMPLATES = [
    {
        "category": "🎧 Earphones & TWS",
        "product": "Sony WH-CH520 Wireless (50H Battery) / boAt Bassheads",
        "text": (
            "Bhai agar under ₹1,000 to ₹4,000 me dekh rahe ho to Sony WH-CH520 ya boAt best hai. "
            "Filhal Flipkart/Amazon par verified lowest price chal raha hai: {store_url}\n\n"
            "Maine TheBhom Deals par price compare kiya tha: {page_url}\n"
            "Aur daily verified loot alerts ke liye TheBhom Deals channel bhi check kar sakte ho."
        )
    },
    {
        "category": "👟 Fashion & Sneakers",
        "product": "Red Tape Casual Sneakers / Adidas Stridzo",
        "text": (
            "Sneakers me Red Tape aur Adidas ke pairs abhi 60-70% discount par mil rahe hain. "
            "Direct store buy link: {store_url}\n"
            "Detailed reviews & size guide: {page_url}"
        )
    },
    {
        "category": "🍳 Home & Kitchen",
        "product": "Philips Air Fryer / Borosil Lunch Sets",
        "text": (
            "Kitchen appliances me Philips Air Fryer par 35% price drop aaya hua hai. "
            "Check kar lo direct official store par: {store_url}\n"
            "All verified specs: {page_url}"
        )
    }
]

def print_dashboard():
    print("=" * 65)
    print("🚀 THEBHOM COMMUNITY DEAL SNIPER DASHBOARD")
    print("=" * 65)
    print("\n📌 TOP 7 ACTIVE TELEGRAM SHOPPING COMMUNITIES:")
    for i, g in enumerate(TOP_GROUPS, 1):
        print(f"  {i}. {g['name']}")
        print(f"     👉 Open in Telegram: tg://resolve?domain={g['handle']}")
        print(f"     🌐 Web Link: https://t.me/{g['handle']}")
        print(f"     ℹ️  {g['desc']}\n")

    print("=" * 65)
    print("💬 READY-TO-PASTE VALUE-FIRST REPLY TEMPLATES:")
    print("=" * 65)
    
    # Extract real product deals
    sample_deal = {
        "store_url": "https://fktr.in/aOffVlY",
        "page_url": "https://thebhom.in/deals/"
    }
    
    for t in TEMPLATES:
        print(f"\n🏷️ [{t['category']}] - {t['product']}")
        print("-" * 50)
        print(t['text'].format(**sample_deal))
        print("-" * 50)

if __name__ == "__main__":
    print_dashboard()
