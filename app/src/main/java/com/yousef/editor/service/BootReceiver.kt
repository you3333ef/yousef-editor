package com.yousef.editor.service

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.yousef.editor.prefs.SettingsManager

/**
 * BootReceiver - Starts the service on device boot if auto-start is enabled
 */
class BootReceiver : BroadcastReceiver() {

    companion object {
        const val TAG = "BootReceiver"
    }

    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            Intent.ACTION_BOOT_COMPLETED,
            Intent.ACTION_MY_PACKAGE_REPLACED,
            Intent.ACTION_PACKAGE_REPLACED -> {
                Log.d(TAG, "Device boot completed, checking auto-start settings")

                val settings = SettingsManager(context)
                if (settings.isAutoStartEnabled()) {
                    Log.d(TAG, "Auto-start enabled, starting CodeServerService")
                    val serviceIntent = Intent(context, CodeServerService::class.java).apply {
                        action = CodeServerService.ACTION_START
                    }
                    context.startForegroundService(serviceIntent)
                } else {
                    Log.d(TAG, "Auto-start disabled, not starting service")
                }
            }
            else -> {
                Log.d(TAG, "Received unknown action: ${intent.action}")
            }
        }
    }
}
