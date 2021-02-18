tell application "iTerm2"
  create window with default profile
  tell current session of current window
    write text "app-upgrade && code app"
    write text "app-upgrade:dev:firebase"
  end tell
  tell current session of current window
    set verticalPane to (split vertically with default profile)
    tell verticalPane
      write text "app-upgrade:dev:common"
      set quadrantPane to (split horizontally with default profile)
      tell quadrantPane
        write text "app-upgrade:dev:functions"
      end tell
    end tell
  end tell
  tell current session of current window
    set lastQuadrant to (split horizontally with default profile)
    tell lastQuadrant
      write text "app-upgrade:dev:app"
    end tell
  end tell
end tell