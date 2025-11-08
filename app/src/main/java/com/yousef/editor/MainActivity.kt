package com.yousef.editor

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private lateinit var errorView: View
    private lateinit var retryButton: Button
    private lateinit var setupButton: Button
    private lateinit var errorText: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Create views programmatically
        val layout = android.widget.LinearLayout(this).apply {
            orientation = android.widget.LinearLayout.VERTICAL
            setPadding(40, 40, 40, 40)
        }

        // Title
        val title = TextView(this).apply {
            text = "Yousef Editor"
            textSize = 28f
            setTextColor(getColor(android.R.color.white))
            setPadding(0, 20, 0, 40)
        }
        layout.addView(title)

        // WebView
        webView = WebView(this)
        webView.layoutParams = android.widget.LinearLayout.LayoutParams(
            android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
            0,
            1f
        )
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.allowFileAccess = true
        webView.settings.allowContentAccess = true
        webView.settings.allowFileAccessFromFileURLs = true
        webView.settings.allowUniversalAccessFromFileURLs = true
        webView.settings.setSupportZoom(true)
        webView.settings.builtInZoomControls = true
        webView.settings.displayZoomControls = false
        webView.settings.loadWithOverviewMode = true
        webView.settings.useWideViewPort = true

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                errorView.visibility = View.GONE
                webView.visibility = View.VISIBLE
            }

            override fun onReceivedError(
                view: WebView?,
                errorCode: Int,
                description: String?,
                failingUrl: String?
            ) {
                super.onReceivedError(view, errorCode, description, failingUrl)
                showError("Cannot connect to code-server. Make sure code-server is running on port 8080.")
            }
        }

        layout.addView(webView)

        // Error View
        errorView = View(this)
        errorView.visibility = View.GONE
        errorView.setBackgroundColor(getColor(android.R.color.holo_red_dark))
        errorView.setPadding(20, 20, 20, 20)

        val errorTitle = TextView(this).apply {
            text = "⚠️ Connection Error"
            textSize = 20f
            setTextColor(getColor(android.R.color.white))
            setPadding(0, 0, 0, 20)
        }
        errorView.addView(errorTitle)

        errorText = TextView(this).apply {
            text = "Code-server is not running.\n\nTo fix this:\n1. Install Termux from F-Droid or Play Store\n2. In Termux, run:\n   pkg install nodejs\n   npm install -g code-server\n   code-server --port 8080\n\nOr use external code-server URL in settings."
            textSize = 14f
            setTextColor(getColor(android.R.color.white))
        }
        errorView.addView(errorText)

        val buttonLayout = android.widget.LinearLayout(this).apply {
            orientation = android.widget.LinearLayout.HORIZONTAL
            setPadding(0, 20, 0, 0)
        }

        setupButton = Button(this).apply {
            text = "Install Termux"
            setBackgroundColor(getColor(android.R.color.holo_blue_dark))
            setTextColor(getColor(android.R.color.white))
            layoutParams = android.widget.LinearLayout.LayoutParams(
                0,
                android.widget.LinearLayout.LayoutParams.WRAP_CONTENT,
                1f
            ).apply {
                setMargins(0, 20, 10, 0)
            }
            setOnClickListener {
                installTermux()
            }
        }
        buttonLayout.addView(setupButton)

        retryButton = Button(this).apply {
            text = "Try Again"
            setBackgroundColor(getColor(android.R.color.holo_green_dark))
            setTextColor(getColor(android.R.color.white))
            layoutParams = android.widget.LinearLayout.LayoutParams(
                0,
                android.widget.LinearLayout.LayoutParams.WRAP_CONTENT,
                1f
            ).apply {
                setMargins(10, 20, 0, 0)
            }
            setOnClickListener {
                loadCodeServer()
            }
        }
        buttonLayout.addView(retryButton)

        errorView.addView(buttonLayout)

        val externalButton = Button(this).apply {
            text = "Use External URL"
            setBackgroundColor(getColor(android.R.color.holo_orange_dark))
            setTextColor(getColor(android.R.color.white))
            setOnClickListener {
                showExternalUrlDialog()
            }
            setPadding(0, 20, 0, 0)
        }
        errorView.addView(externalButton)

        layout.addView(errorView)

        setContentView(layout)

        // Try to load code-server
        loadCodeServer()
    }

    private fun loadCodeServer() {
        webView.visibility = View.GONE
        errorView.visibility = View.GONE

        // Check if code-server is running
        Thread {
            try {
                val url = URL("http://localhost:8080")
                val conn = url.openConnection() as HttpURLConnection
                conn.connectTimeout = 5000
                conn.readTimeout = 5000
                val responseCode = conn.responseCode
                conn.disconnect()

                runOnUiThread {
                    if (responseCode == 200) {
                        webView.loadUrl("http://localhost:8080")
                    } else {
                        showError("Code-server is not responding. Make sure it's running on port 8080.")
                    }
                }
            } catch (e: Exception) {
                runOnUiThread {
                    showError("Cannot connect to code-server. Please start code-server in Termux:\n\ncode-server --port 8080")
                }
            }
        }.start()
    }

    private fun showError(message: String) {
        webView.visibility = View.GONE
        errorText.text = message
        errorView.visibility = View.VISIBLE
    }

    private fun installTermux() {
        val intent = Intent(Intent.ACTION_VIEW).apply {
            data = Uri.parse("https://f-droid.org/packages/com.termux/")
        }
        try {
            startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(this, "Please install F-Droid or download Termux from GitHub", Toast.LENGTH_LONG).show()
        }
    }

    private fun showExternalUrlDialog() {
        val input = android.widget.EditText(this)
        input.hint = "http://your-server:8080"
        input.setText("http://localhost:8080")

        AlertDialog.Builder(this)
            .setTitle("External Code-Server URL")
            .setMessage("Enter the URL of your code-server instance:")
            .setView(input)
            .setPositiveButton("Connect") { _, _ ->
                val url = input.text.toString()
                if (url.isNotEmpty()) {
                    webView.loadUrl(url)
                    webView.visibility = View.VISIBLE
                    errorView.visibility = View.GONE
                }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}

