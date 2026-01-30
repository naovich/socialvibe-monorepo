# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - heading "SocialVibe" [level=1] [ref=e6]
    - paragraph [ref=e7]: Welcome back! Sign in to continue
  - generic [ref=e8]:
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]: Email
        - textbox "alice@socialvibe.com" [ref=e12]
      - generic [ref=e13]:
        - generic [ref=e14]: Password
        - textbox "••••••••" [ref=e15]
        - link "Forgot password?" [ref=e17] [cursor=pointer]:
          - /url: /forgot-password
      - button "Sign In" [ref=e18]
    - paragraph [ref=e20]:
      - text: Don't have an account?
      - link "Sign Up" [ref=e21] [cursor=pointer]:
        - /url: /register
    - generic [ref=e22]:
      - paragraph [ref=e23]: "Test Accounts (password: password123)"
      - generic [ref=e24]:
        - button "alice" [ref=e25]
        - button "bob" [ref=e26]
        - button "charlie" [ref=e27]
        - button "diana" [ref=e28]
```