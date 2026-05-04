from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.db.client import supabase
from app.schemas.er_diagram import ERDiagramCreate, ERDiagramUpdate, ERDiagramResponse
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[ERDiagramResponse])
async def list_diagrams(current_user: dict = Depends(get_current_user)):
    """List all ER diagrams for the current user."""
    res = supabase.table("er_diagrams").select("*").eq("user_id", current_user["id"]).execute()
    return res.data

@router.post("/", response_model=ERDiagramResponse)
async def create_diagram(diagram: ERDiagramCreate, current_user: dict = Depends(get_current_user)):
    """Create a new ER diagram."""
    data = diagram.model_dump()
    data["user_id"] = current_user["id"]
    res = supabase.table("er_diagrams").insert(data).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create diagram")
    return res.data[0]

@router.get("/{diagram_id}", response_model=ERDiagramResponse)
async def get_diagram(diagram_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific ER diagram."""
    res = supabase.table("er_diagrams").select("*").eq("id", diagram_id).eq("user_id", current_user["id"]).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Diagram not found")
    return res.data[0]

@router.put("/{diagram_id}", response_model=ERDiagramResponse)
async def update_diagram(diagram_id: str, diagram: ERDiagramUpdate, current_user: dict = Depends(get_current_user)):
    """Update an ER diagram."""
    update_data = diagram.model_dump(exclude_unset=True)
    res = supabase.table("er_diagrams").update(update_data).eq("id", diagram_id).eq("user_id", current_user["id"]).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Diagram not found")
    return res.data[0]

@router.delete("/{diagram_id}")
async def delete_diagram(diagram_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an ER diagram."""
    res = supabase.table("er_diagrams").delete().eq("id", diagram_id).eq("user_id", current_user["id"]).execute()
    return {"status": "success"}
